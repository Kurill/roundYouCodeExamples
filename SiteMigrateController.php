<?php

class SiteMigrateController extends Controller {

    protected $newProjectId;
    protected $xmlObj;
    
    public function actionExport($id) {
        if (!UserProject::isAccess('admin_or_owner', $id)) {
            $this->render('application.views.site.accessdenied');
            exit();
        }
        
        $this->xmlObj = new SimpleXMLElement('<?xml version="1.0" encoding="utf-8"?><website></website>');

        //сохраняем запись о проекте
        $name = $this->saveProject($id); //настройки сайта
        $this->saveGroups($id); //группы страниц
        $this->saveManualPages($id); //страницы добавленные вручную
        $this->saveDeliveryList($id); // список рассылки
        $this->xmlObj->asXML(Yii::getPathOfAlias('webroot') . DIRECTORY_SEPARATOR . 'project_migrate' . DIRECTORY_SEPARATOR . 'export_' . $name . '.xml');
        $this->file_force_download(Yii::getPathOfAlias('webroot') . DIRECTORY_SEPARATOR . 'project_migrate' . DIRECTORY_SEPARATOR . 'export_' . $name . '.xml');
    }

    public function actionImport($id) {
        //получаем файл с дампом проекта
        $file = CUploadedFile::getInstanceByName('import_file');
        $this->xmlObj = simplexml_load_file($file->getTempName());
        $file->reset();
        
        //сбрасываем старые настройки проекта
        $this->clearProjectSettings($id);
        $project = Project::model()->findByPk($id);
        $project->scenario = 'console';
        
        //сохраняем все свойства проекта
        foreach($this->xmlObj->project->children() as $key=>$value){
            if ($key == 'tariff_id' || $key == 'payday' || $key == 'active' || $key == 'deleted' || $key == 'status_id' || $key == 'note' || $key =='user_host') {
                    continue;
                }
            $project->$key = $value;
        }       
        
        //сохраняем проет
        if(!$project->save()){
            var_dump($project->getErrors());
            exit();
        }else{
            //загружаем остальные настройки
            $this->loadGroups($project->id);  //группы страниц
            $this->loadManualPages($project->id); //страницы добавленные вручную
            $this->loadDeliveryList($project->id); //список рассылки
        }
        $this->render('index', array('project' => Project::model()->findByPk($id), 'saved'=>true));
    }

    public function actionIndex($id) {
        $project = Project::model()->findByPk($id);
        $this->render('index', array('project' => $project, 'saved'=>false));
    }

    protected function loadGroups($project_id) {
        //получаем все группы страниц
        foreach ($this->xmlObj->groups->children() as $group) {
            $new_group = new GroupOfPages('console');
            $group_id = null;
            //для каждой группы заполняем все свойства, кроме id
            foreach ($group->children() as $key => $value) {
                if ($key == 'id') {
                    $group_id = $value;
                    continue;
                }
                $new_group->$key = $value;
            }
            //присваиваем группе проект
            $new_group->project_id = $project_id;
            if (!$new_group->save()) {
                var_dump($new_group->getErrors());
                exit();
            } else {
                //для каждой группы
                $this->loadUrlFilters($group_id, $new_group->id); // загружаем фильтры URL
                $this->loadContFilters($group_id, $new_group->id); // загружаем фильтры по контенту 
            }
        }
    }

    protected function loadManualPages($project_id) {
        //выбираем все страницы добавленные вручную
        foreach ($this->xmlObj->manual_pages->children() as $manual) {
            $mp = new ManualPages('console');
            //заполняем свойства страниц
            foreach ($manual->children() as $key => $value) {
                $mp->$key = $value;
            }
            $mp->project_id = $project_id;
            if (!$mp->save()) {
                var_dump($mp->getErrors());
                exit();
            }
        }
    }
    protected function loadDeliveryList($project_id) {
        //получем все списки рассылки
        foreach ($this->xmlObj->delivery_list->children() as $delivery_list) {
            $dl = new DeliveryList('console');
            //сохраняем свойства
            foreach ($delivery_list->children() as $key => $value) {
                $dl->$key = $value;
            }
            //присваиваем id проекта
            $dl->project_id = $project_id;
            if (!$dl->save(false)) {
                var_dump($dl->getErrors());
                exit();
            }
        }
    }

    protected function loadUrlFilters($oldGroupId, $newGroupId) {
        $names = array();
        //получаем списк URL фильтров проекта
        foreach ($this->xmlObj->url_filters->children() as $filter) {
            //оставляем фильтры только нужной нам группы
            if ((int) $filter->group_id != (int) $oldGroupId) {
                continue;
            }
            $new_filter = new UrlFilter('console');
            //сохраняем свойства
            foreach ($filter->children() as $key => $value) {
                $new_filter->$key = $value;
            }
            //исключаем повторение фильтров
            if (in_array((string) $new_filter->name, $names)) {
                continue;
            }
            //добавляем фильтр в список уже добавленных
            $names[] = (string) $new_filter->name;
            //сохраняем id группы у фильтра
            $new_filter->group_id = $newGroupId;
            if (!$new_filter->save()) {
                var_dump($new_filter->getErrors());
                exit();
            }
        }
    }

    protected function loadContFilters($oldGroupId, $newGroupId) {
        $names = array();
        //получаем список фильтров содержимого
        foreach ($this->xmlObj->cont_filters->children() as $filter) {
            //оставляем фильтры только нужной нам группы
            if ((int) $filter->group_id != (int) $oldGroupId)
                continue;
            $new_filter = new ContentFilter('console');
            //сохраняем свойства
            foreach ($filter->children() as $key => $value) {
                $new_filter->$key = $value;
            }
            if (in_array((string) $new_filter->name, $names)) {
                continue;
            }
            //исключаем повторение фильтров
            $names[] = (string) $new_filter->name;
            //сохраняем id группы у фильтра
            $new_filter->group_id = $newGroupId;
            if (!$new_filter->save()) {
                var_dump($new_filter->getErrors());
                exit();
            }
        }
    }

    protected function saveProject($projectId) {
        //ищем проект
        $project = Project::model()->findByPk($projectId);
        $this->xmlObj->addChild('project');
        //сохраняем все его свойства, кроме...
        foreach ($project->attributes as $key => $value) {
            if ($key == 'id' || $key == 'tariff_id' || $key == 'payday' || $key == 'active' || $key == 'deleted' || $key == 'status_id' || $key == 'note' || $key =='user_host') {
                    continue;
                }
            $this->xmlObj->project->addChild($key, $value);
        }
        return $project->name;
    }

    protected function saveGroups($projectId) {
        //ищем все группы проекта
        $groups = GroupOfPages::model()->findAllByAttributes(array('project_id' => $projectId));
        //добавляем группы и фильтры
        $this->xmlObj->addChild('groups');
        $this->xmlObj->addChild('url_filters'); 
        $this->xmlObj->addChild('cont_filters');
        foreach ($groups as $group) {
            //для каждой группы сохраняем все свойства, кроме id проекта
            $groupNode = $this->xmlObj->groups->addChild('group');
            foreach ($group->attributes as $key => $value) {
                if ($key == 'project_id') {
                    continue;
                }
                $groupNode->addChild($key, $value);
            }
            //добавляем все фильтры
            $this->saveUrlFilters($group->id);
            $this->saveContFilters($group->id);
        }
    }

    protected function saveUrlFilters($groupId) {
        //ищем все фильтры группы
        $criteria = new CDbCriteria;
        $criteria->compare('group_id', $groupId);
        $filters = UrlFilter::model()->findAll($criteria);
        
        //добавляем в XML все свойства каждого фильтра, кроме id
        foreach ($filters as $filter) {
            $filterNode = $this->xmlObj->url_filters->addChild('url_filter');
            foreach ($filter->attributes as $key => $value) {
                if ($key == 'id') {
                    continue;
                }
                $filterNode->addChild($key, $value);
            }
        }
    }

    protected function saveContFilters($groupId) {
        //ищем все фильтры группы
        $criteria = new CDbCriteria;
        $criteria->compare('group_id', $groupId);
        $filters = ContentFilter::model()->findAll($criteria);
        //добавляем в XML все свойства каждого фильтра, кроме id
        foreach ($filters as $filter) {
            $filterNode = $this->xmlObj->cont_filters->addChild('cont_filter');
            foreach ($filter->attributes as $key => $value) {
                if ($key == 'id') {
                    continue;
                }
                $filterNode->addChild($key);
                $filterNode->$key = $value;
            }
        }
    }

    protected function saveManualPages($projectId) {
        //получаем все страницы, добавленные вручную
        $criteria = new CDbCriteria;
        $criteria->compare('project_id', $projectId);
        $manualPages = ManualPages::model()->findAll($criteria);
        //добавляем ноду для ручных страниц
        $this->xmlObj->addChild('manual_pages');
        //добавляем в XML все свойства каждой страницы, кроме id и проекта
        foreach ($manualPages as $page) {
            $mpageNode = $this->xmlObj->manual_pages->addChild('mpage');
            foreach ($page->attributes as $key => $value) {
                if ($key == 'project_id' || $key == 'id') {
                    continue;
                }
                $mpageNode->addChild($key, $value);
            }
        }
    }
    
    protected function saveDeliveryList($projectId) {
        //получаем все рассылки проекта
        $criteria = new CDbCriteria;
        $criteria->compare('project_id', $projectId);
        $deliveryLists = DeliveryList::model()->findAll($criteria);
        //добавляем ноду для рассылок
        $this->xmlObj->addChild('delivery_list');
        //сохраняем все рассылки и их свойства
        foreach ($deliveryLists as $deliv) {
            $mpageNode = $this->xmlObj->delivery_list->addChild('dlist');
            foreach ($deliv->attributes as $key => $value) {
                if ($key == 'project_id' || $key == 'id' || $key == 'last_mail') {
                    continue;
                }
                $mpageNode->addChild($key, $value);
            }
        }
    }

    private function file_force_download($file) {
        if (file_exists($file)) {
            // сбрасываем буфер вывода PHP, чтобы избежать переполнения памяти выделенной под скрипт
            // если этого не сделать файл будет читаться в память полностью!
            if (ob_get_level()) {
                ob_end_clean();
            }
            // заставляем браузер показать окно сохранения файла
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename=' . basename($file));
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($file));
            // читаем файл и отправляем его пользователю
            //echo file_get_contents($file);
            readfile($file);
            exit();
        }
    }
    private function clearProjectSettings($id){
        $criteria = new CDbCriteria;
        $criteria->compare('project_id', $id);
        //удаляем все страницы, добавленные вручную
        ManualPages::model()->deleteAll($criteria);
        //удаляем все списки рассылок
        DeliveryList::model()->deleteAll($criteria);
        //удаляем все группы страниц
        GroupOfPages::model()->deleteAll($criteria);
    }

}
