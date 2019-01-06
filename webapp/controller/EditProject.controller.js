sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./DialogCreateProject", "./DialogCreateMember", "./DialogEditMember", "./DialogEvaluateMember", "./PopoverShowProjectMembers", "./DialogEditProject",
	"./utilities",
	"sap/ui/core/routing/History","sap/ui/model/json/JSONModel"
], function(BaseController, MessageBox, DialogCreateProject, DialogCreateMember, DialogEditMember, DialogEvaluateMember, PopoverShowProjectMembers, DialogEditProject, Utilities, History,JSONModel) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.mobileEnterpriseProject.controller.EditProject", {
		onInit: function () {
			var oViewModel = new JSONModel({
				busy : false,
				delay : 0
			});

			this.oRouter.getRouter("editProject").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},
		_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
			//	this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("ProjectInfoSet", {
						Id :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},
				_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},
				_onMetadataLoaded : function () {
				// Store original busy indicator delay for the detail view
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView");

				// Make sure busy indicator is displayed immediately when
				// detail view is displayed for the first time
				oViewModel.setProperty("/delay", 0);

				// Binding the view will set it to not busy - so the view is always busy if it is not bound
				oViewModel.setProperty("/busy", true);
				// Restore original busy indicator delay for the detail view
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			},
				_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					// if object could not be found, the selection in the master list
					// does not make sense anymore.
				//	this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = oElementBinding.getPath();
				/*	oResourceBundle = this.getResourceBundle(),
					oObject = oView.getModel().getObject(sPath),
					sObjectId = oObject.Id,
					sObjectName = oObject.Naam,
					oViewModel = this.getModel("detailView");*/

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			
			},
			
					onPress: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("createTeamLid");
		},

				
	});
}, /* bExport= */ true);
