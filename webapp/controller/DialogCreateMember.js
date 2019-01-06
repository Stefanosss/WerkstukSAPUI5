sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function(ManagedObject, MessageBox, Utilities, History,MessageToast) {

	return ManagedObject.extend("com.sap.build.standard.mobileEnterpriseProject.controller.DialogCreateMember", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.mobileEnterpriseProject.view.DialogCreateMember", this);
			this._bInit = false;
		},

		exit: function() {
			delete this._oView;
		},

		getView: function() {
			return this._oView;
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
		_oDataCall: function() {
				
			 var Naam = this.getView().byId("Naam").mProperties.value;
            var Functie =this.getView().byId("Functie").mProperties.value;
			var view = this.getView();
               
                
            this.getView().getModel().read("/MembersInfoSet",{
            	success: function(resp)
            	{
            		var last = resp.results.length - 1;
            		var id = resp.results[last].Memberid;
            		id = parseInt(id);
            		id++;
            		
            		 var properties = {
                	"Memberid": id +"",
                    "Naam" : Naam,
                    "Functie" : Functie
                     };
            		
            		view.getModel().create("/MembersInfoSet",properties,
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
		/*_oDataCall:function(oEvent)
 		{
	
		var myModel = sap.ui.getCore().getModel("myModel");
		
		// CREATE******************
			var obj = {};
			obj.name = this.getView().byId("Name").getValue();
			obj.function = this.getView().byId("Function").getValue();
			myModel.create('/MemberInfoSet', obj, {
				wa_cds_smembers : function(oData, oResponse) {
					this.close();
				},
			
				
			});
	
		},*/
		
		_onButtonPress: function() {

			this.close();

		},
 
		onInit: function() {
		// Create Model Instance of the oData service
		var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/SAP/YXM_136_ODATACRUD_SRV");
		sap.ui.getCore().setModel(oModel, "myModel");
		
		
	},
		onExit: function() {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);
