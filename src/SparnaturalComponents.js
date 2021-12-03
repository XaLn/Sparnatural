

	export class HTMLComponent {

		constructor(baseCssClass, cssClasses, parentComponent, widgetHtml) {
			this.baseCssClass = baseCssClass;
			this.cssClasses = cssClasses;
			this.parentComponent = parentComponent;
			this.widgetHtml = widgetHtml;
			this.html = $();
		}

		attachComponentHtml() {
			// remove existing component if already existing
			this.parentComponent.html.find('>.'+this.baseCssClass).remove() ;
			$(this.html).appendTo(this.parentComponent.html) ;
		}

		/**
		 * Updates the CSS classes of an element
		 **/
		updateCssClasses() {
			$(this.html).removeClass('*') ;
			for (var item in this.cssClasses) {				
				if (this.cssClasses[item] === true) {
					$(this.html).addClass(item) ;
				} else {
					$(this.html).removeClass(item) ;
				}
			}
		}

		initHtml() {				
			if (this.widgetHtml != null) {
				this.html = $('<div class="'+this.baseCssClass+'"></div>') ;
				// remove existing component
				// this.component.html.find('>.'+instance ).remove();
				this.html.append(this.widgetHtml) ; 
			} else {
				this.html = $();
			}
		} 

		attachHtml() {
			this.updateCssClasses() ;
			this.attachComponentHtml() ;
		}	
	}

	export class GroupContenaire extends HTMLComponent {

		constructor(baseCssClass, parentCriteriaGroup) {
			super(
	 			baseCssClass,
	 			{
					HasInputsCompleted : false,
					IsOnEdit : false,
					Invisible: false
				},
				parentCriteriaGroup,
				null
	 		);
			this.parentCriteriaGroup = parentCriteriaGroup;
			this.inputTypeComponent = null ;

			// TODO : to be removed from here
			this.value_selected = null ;
			this.variableNamePreload = null ;
		}		

		
		init() {			
			if (!this.cssClasses.Created) {				
				this.cssClasses.IsOnEdit = true ;
				this.initHtml() ;
				this.attachHtml() ;
				this.cssClasses.Created = true ;				
			} else {
				this.updateCssClasses() ;
			}
		} ;
	} 



	/**
	 * Selection of the start class in a criteria/line
	 **/
	export class OptionsGroup extends GroupContenaire {

		constructor(parentCriteriaGroup, specProvider) { 
			super(
				"OptionsGroup",
				parentCriteriaGroup
			);

			this.specProvider = specProvider;
			this.cssClasses.OptionsGroup = true ;
			this.cssClasses.Created = false ;
			this.valuesSelected = [] ;
			
			this.inputTypeComponent = new OptionTypeId(this, specProvider) ;

			this.init() ;
			$(this.html).append('<div class="EditComponents"></div>');
		}

		onObjectPropertyGroupSelected() {
			if($(this.html).find('div.ShowOnEdit').length == 0){
				$(this.html).find('div.EditComponents').addClass('ShowOnEdit');
				var parentOptionEnable = false ;
				$(this.html).parents('li.groupe').each(function(){
					if ($(this).hasClass('optionEnabled')) {
						parentOptionEnable = true ;
					}
				});

				if (
					parentOptionEnable
					||
					(
						!this.specProvider.isEnablingOptional(this.parentCriteriaGroup.ObjectPropertyGroup.value_selected)
						&&
						!this.specProvider.isEnablingNegation(this.parentCriteriaGroup.ObjectPropertyGroup.value_selected)
					)
				) {
					$(this.html).find('.EditComponents').addClass('Disabled') ;
				} else {
					$(this.html).find('.EditComponents').addClass('Enabled') ;
				}

				$(this.html).find('.EditComponents').on('click', function(e) {
					if($(e.target).hasClass('Enabled')) {
						$(e.target).parents('.OptionsGroup').first().toggleClass('Opended') ;
						redrawBottomLink($(e.target).parents('li.groupe').first()) ;
					}
				}) ;

				this.inputTypeComponent.init() ;
				this.inputTypeComponent.cssClasses.IsOnEdit = true;

				$(this.html).find('.input-val label').on('click', function(e) {
					$(e.target).addClass('justClicked') ;
				});
				$(this.html).find('.input-val input').on('click', function(e) {
					e.stopPropagation();
				});
				$(this.html).find('.input-val label').on('click', {arg1: this, arg2: 'onChange'}, eventProxiCriteria);

				if(this.inputTypeComponent.needTriggerClick == true) {
					if (this.inputTypeComponent.default_value['optional']) {
						$(this.html).find('.input-val input[data-id="optional"]').parents('label').first().trigger('click') ;
					} else if (this.inputTypeComponent.default_value['notExists']) {
						$(this.html).find('.input-val input[data-id=notExists]').parents('label').first().trigger('click') ;
					}
					this.inputTypeComponent.needTriggerClick = false ;
				}
			}
		}

		// triggered when a criteria starts
		onCreated() {

		}

		onChange() {
			var optionsInputs = $(this.html).find('.input-val input').get() ;
			var optionSelected = false ;
			for (var item in  optionsInputs) {
				if ($(optionsInputs[item]).parents('label').first().hasClass("justClicked")) {
					if(this.valuesSelected[$(optionsInputs[item]).attr('data-id')] !== true) {
						this.valuesSelected[$(optionsInputs[item]).attr('data-id')]  = true ;
						$(optionsInputs[item]).parents('label').first().addClass('Enabled');
						optionSelected = true ;
						$(optionsInputs[item]).parents('li.groupe').first().addClass($(optionsInputs[item]).attr('data-id')+'-enabled') ;
					} else {
						this.valuesSelected[$(optionsInputs[item]).attr('data-id')]  = false ;
						$(optionsInputs[item]).parents('label').first().removeClass('Enabled');
						optionsInputs[item].checked = false; 
						$(optionsInputs[item]).parents('li.groupe').first().removeClass($(optionsInputs[item]).attr('data-id')+'-enabled') ;
					}					
				} else {					
					this.valuesSelected[$(optionsInputs[item]).attr('data-id')]  = false ;
					$(optionsInputs[item]).parents('label').first().removeClass('Enabled');
					$(optionsInputs[item]).parents('li.groupe').first().removeClass($(optionsInputs[item]).attr('data-id')+'-enabled') ;
				}
			}

			if (optionSelected == true ) {
				$(this.parentCriteriaGroup.html).parents('li').first().addClass('optionEnabled') ;
				$(this.parentCriteriaGroup.html).parents('li').first().parents('li.groupe').each(function() {
					$(this).find('>div>.OptionsGroup .EditComponents').first().addClass('Disabled') ;
					$(this).find('>div>.OptionsGroup .EditComponents').first().removeClass('Enabled') ;
					$(this).find('>div>.OptionsGroup').first().removeClass('Opended') ;

				});
				$(this.parentCriteriaGroup.html).parents('li').first().find('li.groupe').each(function() {
					$(this).find('>div>.OptionsGroup .EditComponents').first().addClass('Disabled') ;
					$(this).find('>div>.OptionsGroup .EditComponents').first().removeClass('Enabled') ;
					$(this).find('>div>.OptionsGroup').first().removeClass('Opended') ;
				});
				$('li.groupe').each(function() {
					redrawBottomLink($(this)) ;
				});

			} else {
				$(this.parentCriteriaGroup.html).parents('li').first().removeClass('optionEnabled') ;
				$(this.parentCriteriaGroup.html).parents('li').first().parents('li.groupe').each(function() {
					$(this).find('>div>.OptionsGroup .EditComponents').first().addClass('Enabled') ;
					$(this).find('>div>.OptionsGroup .EditComponents').first().removeClass('Disabled') ;
				});
				$(this.parentCriteriaGroup.html).parents('li').first().find('li.groupe').each(function() {
					$(this).find('>div>.OptionsGroup .EditComponents').first().addClass('Enabled') ;
					$(this).find('>div>.OptionsGroup .EditComponents').first().removeClass('Disabled') ;
				});
			}

			// update the query
			$(this.parentCriteriaGroup.thisForm_.sparnatural).trigger( {type:"submit" } ) ;

			$(this.html).find('.input-val label').removeClass('justClicked') ;
		};

		setClass(value) {
			$(this.html).find('nice-select ul li[data-value="'+value+'"]').trigger('click');
		}
	} 





	/**
	 * Handles the selection of a Class, either in the DOMAIN selection or the RANGE selection.
	 * The DOMAIN selection happens only for the very first line/criteria.
	 * Refactored to extract this from InputTypeComponent.
	 **/
	export class ClassTypeId extends HTMLComponent {

		constructor(parentComponent, specProvider) {
			super(
	 			"ClassTypeId",
	 			{
					Highlited : true ,
					Created : false
				},
				parentComponent,
				null
	 		);

			this.specProvider = specProvider;
			this.needTriggerClick = false ;
		}

		init() {
			
			//If Start Class 
			if (this.cssClasses.Created) {
				this.updateCssClasses() ;
				return true ;
			}
			var default_value_s = null ;
			var default_value_o = null ;
			
			if(this.parentComponent.parentCriteriaGroup.jsonQueryBranch) {
				var branch = this.parentComponent.parentCriteriaGroup.jsonQueryBranch
				default_value_s = branch.line.sType ;
				default_value_o = branch.line.oType ;
				this.needTriggerClick = true ;
				if (this.parentComponent.baseCssClass == "StartClassGroup") {
					this.parentComponent.variableNamePreload = branch.line.s;
				} else {
					this.parentComponent.variableNamePreload = branch.line.o;
				}
			}

			var selectHtml = null ;
			
			var id = this.parentComponent.parentCriteriaGroup.id ;
			var selectBuilder = new ClassSelectBuilder(this.specProvider);

			if (this.parentComponent.baseCssClass == "StartClassGroup") {
				
				var parentOrSibling = findParentOrSiblingCriteria(this.parentComponent.parentCriteriaGroup.thisForm_, id) ;
				if (parentOrSibling) {
					if (parentOrSibling.type == 'parent' ) {
						// if we are child in a WHERE relation, the selected class is the selected
						// class in the RANGE selection of the parent
						default_value_s = parentOrSibling.element.EndClassGroup.value_selected ;
					} else {
						// if we are sibling in a AND relation, the selected class is the selected
						// class in the DOMAIN selection of the sibling
						default_value_s = parentOrSibling.element.StartClassGroup.value_selected ;
					}
					this.cssClasses.Highlited = false ;
				} else {
					this.cssClasses.Highlited = true ;
				}
				
				this.id = 'a-'+id ;
				this.rowIndex = id;
				this.check
				
				selectHtml = selectBuilder.buildClassSelect(
					null,
					this.id,
					default_value_s
				);
			} 
			
			if (this.parentComponent.baseCssClass == "EndClassGroup") {
				this.id = 'b-'+id ;
				selectHtml = selectBuilder.buildClassSelect(
					this.parentComponent.parentCriteriaGroup.StartClassGroup.value_selected,
					this.id,
					default_value_o
				);
			}
			
			this.widgetHtml = selectHtml ;
			this.cssClasses.IsOnEdit = true ;
			this.initHtml() ;
			this.attachHtml() ;
			this.cssClasses.Created = true ;
		} ;	
		
		reload() {
			console.log("reload on ClassTypeId should probably never be called");
			this.init();
		} ;		
	};


	/**
	 * Refactored to extract this from InputTypeComponent
	 **/
	export class ObjectPropertyTypeId extends HTMLComponent {

		constructor(parentComponent, specProvider) {
			super(
	 			"ObjectPropertyTypeId",
	 			{
					IsCompleted : false,
					IsOnEdit : false,
					Created : false
				},
				parentComponent,
				null
	 		);

			this.specProvider = specProvider;
			this.needTriggerClick = false ;			
		}

		init(reload = false) {
			var selectBuilder = new PropertySelectBuilder(this.specProvider);
			var default_value = null ;

			if(this.parentComponent.parentCriteriaGroup.jsonQueryBranch != null) {
				var default_value = this.parentComponent.parentCriteriaGroup.jsonQueryBranch.line.p ;
				this.needTriggerClick = true ;
			}

			this.widgetHtml = selectBuilder.buildPropertySelect(
				this.parentComponent.parentCriteriaGroup.StartClassGroup.value_selected,
				this.parentComponent.parentCriteriaGroup.EndClassGroup.value_selected,
				'c-'+this.parentComponent.parentCriteriaGroup.id,
				default_value
			) ;
			
			this.cssClasses.IsOnEdit = true ;
			this.initHtml() ;
			this.attachHtml() ;
			this.cssClasses.Created = true ;
		} ;	
		
		reload() {
			this.init(true);
		} ;

	}



	/**
	 * 
	 **/
	 export class OptionTypeId extends HTMLComponent {

	 	constructor(parentComponent, specProvider) {
	 		super(
	 			"OptionTypeId",
	 			{
					Highlited : false ,
					Created : false
				},
				parentComponent,
				null
	 		);

			this.specProvider = specProvider;
			this.needTriggerClick = false ;
			this.default_value = [];
	 	}


		init() {	
			//If Start Class 
			if (this.cssClasses.Created) {
				this.updateCssClasses() ;
				return true ;
			}
			this.default_value['optional'] = false ;
			this.default_value['notexist'] = false ;
			
			if(this.parentComponent.parentCriteriaGroup.jsonQueryBranch) {
				var branch = this.parentComponent.parentCriteriaGroup.jsonQueryBranch
				this.default_value['optional'] = branch.optional ;
				this.default_value['notexist'] = branch.notExists ;
				this.needTriggerClick = true ;
			}

			var id = this.parentComponent.parentCriteriaGroup.id ;
			var selectBuilder = new OptionSelectBuilder(this.specProvider);

			this.id = 'option-'+id ;
			var selectHtml = selectBuilder.buildOptionSelect(
				this.parentComponent.parentCriteriaGroup.ObjectPropertyGroup.value_selected,
				this.id,
				this.default_value
			);
			
			
			this.widgetHtml = selectHtml ;
			this.cssClasses.IsOnEdit = true ;
			this.initHtml() ;
			this.attachHtml() ;
			this.cssClasses.Created = true ;
		} ;	
		
		reload() {
			console.log("reload on OptionTypeId should probably never be called");
			this.init();
		} ;		
	}


	/**
	 * Builds a selector for a class based on provided domainId, by reading the
	 * configuration. If the given domainId is null, this means we populate the first
	 * class selection (starting point) so reads all classes that are domains of any property.
	 * 
	 **/
	class ClassSelectBuilder {
		constructor(specProvider) {
			this.specProvider = specProvider;
		}

		buildClassSelect(domainId, inputID, default_value) {
			var list = [] ;
			var items = [] ;

			if(domainId === null) {
				// if we are on the first class selection
			 	items = this.specProvider.getClassesInDomainOfAnyProperty() ;
			} else {
				items = this.specProvider.getConnectedClasses(domainId) ;
			}

			for (var key in items) {
				var val = items[key];
				var label = this.specProvider.getLabel(val) ;
				var icon = this.specProvider.getIcon(val) ;
				var highlightedIcon = this.specProvider.getHighlightedIcon(val) ;

				// highlighted icon defaults to icon
				if (!highlightedIcon || 0 === highlightedIcon.length) {
					highlightedIcon = icon ;
				}
				
				var image = (icon != null)?' data-icon="' + icon + '" data-iconh="' + highlightedIcon + '"':'' ;
				//var selected = (default_value == val)?'selected="selected"':'';
				var desc = this.specProvider.getTooltip(val) ;
				var selected = (default_value == val)?' selected="selected"':'';
				var description_attr = '';
				if(desc) {
					description_attr = ' data-desc="'+desc+'"';
				} 
				list.push( '<option value="'+val+'" data-id="'+val+'"'+image+selected+' '+description_attr+'  >'+ label + '</option>' );
			}

			var html_list = $( "<select/>", {
				"class": "my-new-list input-val",
				"id": 'select-'+inputID,
				html: list.join( "" )
			  });

			return html_list ;
		}
	}



	/**
	 * 
	 **/
	 class OptionSelectBuilder {
		
	 	constructor(specProvider) {
	 		this.specProvider = specProvider;
	 	}		

		buildOptionSelect(objectId, inputID, default_value) {			
			var items = [] ;
			if(this.specProvider.isEnablingOptional(objectId)) {
				items['optional'] = langSearch.labelOptionOptional ;
			}
			
			if(this.specProvider.isEnablingNegation(objectId)) {
				items['notExists'] = langSearch.labelOptionNotExists ;
			}

			var list = [] ;
			for (var key in items) {
				var label = items[key] ;
				var selected = (default_value[key] == label)?' checked="checked"':'';
				list.push( '<label><input type="radio" name="'+inputID+'" data-id="'+key+'"'+selected+' '+'  />'+ label + '</label>' );
			}

			var html_list = $( "<div/>", {
				"class": "optionsGroupe-list input-val",
				"id": 'select-'+inputID,
				html: list.join( "" )
			});

			return html_list ;
		}
	}


	/**
	 * Builds a selector for property based on provided domain and range, by reading the
	 * configuration.
	 **/
	class PropertySelectBuilder {
		constructor(specProvider) {
			this.specProvider = specProvider;
		}

		buildPropertySelect(domainClassID, rangeClassID, inputID, default_value) {
			var list = [] ;
			var items = this.specProvider.getConnectingProperties(domainClassID,rangeClassID) ;
			
			for (var key in items) {
				var val = items[key];
				var label = this.specProvider.getLabel(val) ;
				var desc = this.specProvider.getTooltip(val) ;
				var selected = (default_value == val)?'selected="selected"':'';
				var description_attr = '';
				if(desc) {
					description_attr = ' data-desc="'+desc+'"';
				} 
				list.push( '<option value="'+val+'" data-id="'+val+'"'+selected+' '+description_attr+'  >'+ label + '</option>' );
			}

			var html_list = $( "<select/>", {
				"class": "select-list input-val",
				"id": inputID,
				html: list.join( "" )
			});
			return html_list ;
		}
	}



	/**
	 * Utility function to find the criteria "above" a given criteria ID, being
	 * either the "parent" in a WHERE criteria, or the "sibling"
	 * in an AND criteria
	 **/
	export function findParentOrSiblingCriteria(thisForm_, id) {
		var dependant = null ;
		var dep_id = null ;
		var element = $(thisForm_.sparnatural).find('li[data-index="'+id+'"]') ;
		
		if ($(element).parents('li').length > 0) {			
			dep_id = $($(element).parents('li')[0]).attr('data-index') ;
			dependant = {type : 'parent'}  ;
		} else {
			if ($(element).prev().length > 0) {
				dep_id = $(element).prev().attr('data-index') ;
				dependant = {type : 'sibling'}  ;				
			}
		}

		$(thisForm_.sparnatural.components).each(function(index) {			
			if (this.index == dep_id) {
				dependant.element = this.CriteriaGroup ;
			}
		}) ;

		return dependant ;
	}

	export function eventProxiCriteria(e) {
		var arg1 = e.data.arg1;
		var arg2 = e.data.arg2;
		arg1[arg2](e) ;
	}