sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function(ManagedObject, MessageBox, Utilities, History,MessageToast) {

	return ManagedObject.extend("com.sap.build.standard.mobileEnterpriseProject.controller.DialogEvaluateMember", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.mobileEnterpriseProject.view.DialogEvaluateMember", this);
			this._bInit = false;
		},

		exit: function() {
			delete this._oView;
		},

		getView: function() {
			return this._oView;
		},
		
		_ok:function(){
			var member = this.getView().byId("memb").getSelectedKey();
            var projectid =this.getView().byId("project").getSelectedKey();
			var view = this.getView();
			var rate = this.getView().byId("rate").mProperties.value;
			
                
            this.getView().getModel().read("/EvaluatieInfoSet",{
            	success: function(resp)
            	{
            		var last = resp.results.length - 1;
            		var id = resp.results[last].Projectid;
            		id = parseInt(id);
            		id++;
            		
            		 var properties = {
                	"Evaluatieid": id +"",
                	"Projectid" : projectid,
                	"Memberid":member,
                	"Score":rate,
                	
               
                     };
            		
            		view.getModel().create("/EvaluatieInfoSet",properties,
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
