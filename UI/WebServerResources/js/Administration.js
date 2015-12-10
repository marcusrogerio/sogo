(function(){"use strict";angular.module("SOGo.AdministrationUI",["ngSanitize","ui.router","SOGo.Common","SOGo.Authentication","SOGo.PreferencesUI","SOGo.ContactsUI","SOGo.SchedulerUI"]).config(configure).run(runBlock);configure.$inject=["$stateProvider","$urlRouterProvider"];function configure($stateProvider,$urlRouterProvider){$stateProvider.state("administration",{"abstract":true,views:{administration:{templateUrl:"administration.html",controller:"AdministrationController",controllerAs:"app"}}}).state("administration.rights",{url:"/rights",views:{module:{templateUrl:"rights.html"}}}).state("administration.rights.edit",{url:"/:userId/:folderId/edit",views:{acl:{templateUrl:"UIxAdministrationAclEditor",controller:"AdministrationAclController",controllerAs:"acl"}},resolve:{stateUser:stateUser,stateFolder:stateFolder}});$urlRouterProvider.otherwise("/rights")}stateUser.$inject=["$q","$stateParams","User"];function stateUser($q,$stateParams,User){var user;user=_.find(User.$users,function(user){return user.uid==$stateParams.userId});if(angular.isUndefined(user)){return User.$filter($stateParams.userId).then(function(users){user=_.find(User.$users,function(user){return user.uid==$stateParams.userId});if(angular.isUndefined(user)){return $q.reject("User with ID "+$stateParams.userId+" not found")}else{return user.$folders().then(function(){return user})}return user})}return user}stateFolder.$inject=["$state","$stateParams","decodeUriFilter","stateUser","AddressBook","Calendar"];function stateFolder($state,$stateParams,decodeUriFilter,stateUser,AddressBook,Calendar){var folder,o,folderId=decodeUriFilter($stateParams.folderId);folder=_.find(stateUser.$$folders,function(folder){return folder.name==folderId});if(folder.type=="Appointment"){o=new Calendar({id:folder.name.split("/").pop(),owner:folder.owner,name:folder.displayName})}else{o=new AddressBook({id:folder.name.split("/").pop(),owner:folder.owner,name:folder.displayName})}stateUser.selectedFolder=o.id;return o}runBlock.$inject=["$log","$rootScope","$state"];function runBlock($log,$rootScope,$state){$rootScope.$on("$stateChangeError",function(event,toState,toParams,fromState,fromParams,error){$log.error(error);$state.go("administration.rights")});$rootScope.$on("$routeChangeError",function(event,current,previous,rejection){$log.error(event,current,previous,rejection)})}})();(function(){"use strict";AdministrationAclController.$inject=["$animate","$state","$mdToast","stateUser","stateFolder","User"];function AdministrationAclController($animate,$state,$mdToast,stateUser,stateFolder,User){var vm=this;vm.user=stateUser;vm.folder=stateFolder;vm.folderType=angular.isDefined(stateFolder.$cards)?"AddressBook":"Calendar";vm.selectedUser=null;vm.selectedUid=null;vm.selectUser=selectUser;vm.removeUser=removeUser;vm.getTemplate=getTemplate;vm.close=close;vm.save=save;vm.userToAdd="";vm.searchText="";vm.userFilter=userFilter;vm.addUser=addUser;stateFolder.$acl.$users(stateFolder.owner).then(function(data){vm.users=data});function getTemplate(){if(angular.isDefined(stateFolder.$cards))return"../"+stateFolder.owner+"/Contacts/"+stateFolder.id+"/UIxContactsUserRightsEditor";return"../"+stateFolder.owner+"/Calendar/"+stateFolder.id+"/UIxCalUserRightsEditor"}function selectUser(user){if(vm.selectedUid==user.uid){vm.selectedUid=null}else{vm.selectedUid=user.uid;vm.selectedUser=user;vm.selectedUser.$rights()}}function userFilter($query){return User.$filter($query,stateFolder.$acl.users,{dry:true})}function removeUser(user){stateFolder.$acl.$removeUser(user.uid).catch(function(data,status){Dialog.alert(l("Warning"),l("An error occured please try again."))})}function addUser(data){if(data){stateFolder.$acl.$addUser(data,stateFolder.owner).then(function(){vm.userToAdd="";vm.searchText=""},function(error){Dialog.alert(l("Warning"),error)})}}function close(){$state.go("administration.rights").then(function(){delete vm.user.selectedFolder;vm.user=null})}function save(){stateFolder.$acl.$saveUsersRights(stateFolder.owner).then(function(){$mdToast.show($mdToast.simple().content(l("ACLs saved")).position("top right").hideDelay(3e3))},function(data,status){Dialog.alert(l("Warning"),l("An error occured please try again."))})}}angular.module("SOGo.AdministrationUI").controller("AdministrationAclController",AdministrationAclController)})();(function(){"use strict";AdministrationController.$inject=["$state","$mdToast","Dialog","encodeUriFilter","User"];function AdministrationController($state,$mdToast,Dialog,encodeUriFilter,User){var vm=this;vm.service=User;vm.selectedUser=null;vm.users=User.$users;vm.go=go;vm.filter=filter;vm.selectUser=selectUser;vm.selectFolder=selectFolder;function go(module){$state.go("administration."+module)}function filter(searchText){User.$filter(searchText)}function selectUser(i){if(vm.selectedUser==vm.users[i]){vm.selectedUser=null}else{vm.users[i].$folders().then(function(){vm.selectedUser=vm.users[i]})}}function selectFolder(folder){$state.go("administration.rights.edit",{userId:vm.selectedUser.uid,folderId:encodeUriFilter(folder.name)})}}angular.module("SOGo.AdministrationUI").controller("AdministrationController",AdministrationController)})();
//# sourceMappingURL=Administration.js.map