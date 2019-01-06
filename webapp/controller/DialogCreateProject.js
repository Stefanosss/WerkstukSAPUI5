sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function(ManagedObject, MessageBox, Utilities, History,MessageToast) {

	return ManagedObject.extend("com.sap.build.standard.mobileEnterpriseProject.controller.DialogCreateProject", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.mobileEnterpriseProject.view.DialogCreateProject", this);
			this._bInit = false;
		},

		exit: function() {
			delete this._oView;
		},

		getView: function() {
			return this._oView;
		},
		_ok:function(){
			var bedrijfid = this.getView().byId("bedrijfid").getSelectedKey();
            var projectnaam =this.getView().byId("projnaam").mProperties.value;
			var view = this.getView();
			var desc = this.getView().byId("projdes").mProperties.value;
			var projm = this.getView().byId("projman").mProperties.value;
			var status =this.getView().byId("status").mProperties.value;
			var date1 =this.getView().byId("date1").mProperties.value;
			var date2 =this.getView().byId("date2").mProperties.value;
                
            this.getView().getModel().read("/ProjectInfoSet",{
            	success: function(resp)
            	{
            		var last = resp.results.length - 1;
            		var id = resp.results[last].Projectid;
            		id = parseInt(id);
            		id++;
            		
            		 var properties = {
                	"Projectid": id +"",
                	"Bedrijfid" : bedrijfid,
                	"Projectnaam":projectnaam,
                	"Description":desc,
                	"Projectmanager":projm,
                	"Status":status,
                	"Begindatum":date1,
                	"Einddatum":date2
               
                     };
            		
            		view.getModel().create("/ProjectInfoSet",properties,
        			 {
        		     success : function(data)
        		     {
        		     	this.close();
        		         MessageToast.show("SaveDone!");
        		        
        		         
        		     },

        		     error : function(data)
        		     {
        		         MessageToast.show("Error");
        		     }
        				});
        		 		
        		 	}
            	
            });
		},

		getControl: function() {
			return this._oControl;
		},

		getOwnerComponent: function() {
			return this._oView.getController().getOwnerComponent();
		},

		open: function() {
			var oView = this._oView;
			var oControl = this._oControl;

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},

		close: function() {
			this._oControl.close();
		},

		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function() {
			return {};

		},
		_onButtonPress: function() {

			this.close();

		},
		onInit: function() {

			this._oDialog = this.getControl();

		},
		onExit: function() {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);
