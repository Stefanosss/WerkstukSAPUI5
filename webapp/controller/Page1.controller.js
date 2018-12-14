sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./DialogCreateProject", "./DialogCreateMember", "./DialogEditMember", "./DialogEvaluateMember", "./PopoverShowProjectMembers", "./DialogEditProject",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, DialogCreateProject, DialogCreateMember, DialogEditMember, DialogEvaluateMember, PopoverShowProjectMembers, DialogEditProject, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.mobileEnterpriseProject.controller.Page1", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App5bf28417669f870111c4b47c";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype") {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onButtonPress: function() {

			var sDialogName = "DialogCreateProject";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new DialogCreateProject(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
		_onButtonPress1: function(oEvent) {

			var sPopoverName = "PopoverShowProjectMembers";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new PopoverShowProjectMembers(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Auto");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		_onButtonPress2: function() {

			var sDialogName = "DialogEditProject";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new DialogEditProject(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
		_onButtonPress3: function() {

			var sDialogName = "DialogCreateMember";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new DialogCreateMember(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
		_onButtonPress4: function() {

			var sDialogName = "DialogEvaluateMember";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new DialogEvaluateMember(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
		_onButtonPress5: function() {

			var sDialogName = "DialogEditMember";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new DialogEditMember(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
		applyFiltersAndSorters: function(sControlId, sAggregationName, chartBindingInfo) {
			if (chartBindingInfo) {
				var oBindingInfo = chartBindingInfo;
			} else {
				var oBindingInfo = this.getView().byId(sControlId).getBindingInfo(sAggregationName);
			}
			var oBindingOptions = this.updateBindingOptions(sControlId);
			this.getView().byId(sControlId).bindAggregation(sAggregationName, {
				model: oBindingInfo.model,
				path: oBindingInfo.path,
				parameters: oBindingInfo.parameters,
				template: oBindingInfo.template,
				templateShareable: true,
				sorter: oBindingOptions.sorters,
				filters: oBindingOptions.filters
			});

		},
		updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var aGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby || oBindingData.groupby === null) {
					aGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = aGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (aGroupby) {
				aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			var oView = this.getView(),
				oData = {},
				self = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			self.oBindingParameters = {};

			oData["sap_Responsive_Page_0-content-sap_m_IconTabBar-1542621245690-items-sap_m_IconTabFilter-1543231501477-content-sap_chart_CombinedChart-1543231700521"] = {};

			oData["sap_Responsive_Page_0-content-sap_m_IconTabBar-1542621245690-items-sap_m_IconTabFilter-1543231501477-content-sap_chart_CombinedChart-1543231700521"]["data"] = [{
				"dim0": "India",
				"mea0": "296",
				"mea1": "220",
				"__id": 0
			}, {
				"dim0": "Canada",
				"mea0": "300",
				"mea1": "150",
				"__id": 1
			}, {
				"dim0": "USA",
				"mea0": "489",
				"mea1": "400",
				"__id": 2
			}, {
				"dim0": "Japan",
				"mea0": "400",
				"mea1": "270",
				"__id": 3
			}, {
				"dim0": "Germany",
				"mea0": "350",
				"mea1": "200",
				"__id": 4
			}];

			self.oBindingParameters['sap_Responsive_Page_0-content-sap_m_IconTabBar-1542621245690-items-sap_m_IconTabFilter-1543231501477-content-sap_chart_CombinedChart-1543231700521'] = {
				"path": "/sap_Responsive_Page_0-content-sap_m_IconTabBar-1542621245690-items-sap_m_IconTabFilter-1543231501477-content-sap_chart_CombinedChart-1543231700521/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_Responsive_Page_0-content-sap_m_IconTabBar-1542621245690-items-sap_m_IconTabFilter-1543231501477-content-sap_chart_CombinedChart-1543231700521"]["vizProperties"] = {
				"dataLabel": {
					"visible": true,
					"hideWhenOverlap": true
				}
			};

			oView.getModel("staticDataModel").setData(oData, true);

			function dateDimensionFormatter(oDimensionValue, sTextValue) {
				var oValueToFormat = sTextValue !== undefined ? sTextValue : oDimensionValue;
				if (oValueToFormat instanceof Date) {
					var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
						style: "short"
					});
					return oFormat.format(oValueToFormat);
				}
				return oValueToFormat;
			}

			var aDimensions = oView.byId("sap_Responsive_Page_0-content-sap_m_IconTabBar-1542621245690-items-sap_m_IconTabFilter-1543231501477-content-sap_chart_CombinedChart-1543231700521").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

		},
		onAfterRendering: function() {

			var oChart,
				self = this,
				oBindingParameters = this.oBindingParameters,
				oView = this.getView();

			oChart = oView.byId("sap_Responsive_Page_0-content-sap_m_IconTabBar-1542621245690-items-sap_m_IconTabFilter-1543231501477-content-sap_chart_CombinedChart-1543231700521");
			oChart.bindData(oBindingParameters['sap_Responsive_Page_0-content-sap_m_IconTabBar-1542621245690-items-sap_m_IconTabFilter-1543231501477-content-sap_chart_CombinedChart-1543231700521']);

		}
	});
}, /* bExport= */ true);
