export class CommonElements {
    
    // View Port is main container for working with every sections (except Header and Main Navigation Bar)
    viewPortSectionSelector =  "*[class^='viewport']" // "*[class^='view-port']" //"*[class*='view-port']"; // try again with *[class^='view-port']
    mainContainer = "main[id='main-content']"
    headerSelector = "#main-content header > ul span"

    // loading Bar
    loadingContainer = "div[class='loading']"
    loadingBar = "div[class*='filled-bar']";
    // searchFormSelector = "form div[class*='form-search easy-search-area']"; 
    inputTextSelector = "input[type]"; //"input[type='text']";
    selectSelector = "input[type='select-multiple']";
    submitBtnSelector = "button[type='submit']"; //Search or Create New 
    resetBtnSelector = "button[type='button']";
    checkboxSelector = "input[type='checkbox']";
    radioBoxSelector = "input[type='radio']";
    buttonSelector = "button[type]";
    
    //Custom Selection
    customSelectionSelector = "d-select"
    optionValues = "div[class='selectize-dropdown-content']:visible div[class^='option']"

    // General Element 
    inputSearchTextSelector = "input[type='search']";
    multiSelectSelector = "select[class^='multiSelect']";
    
    // Footer
    footerSectionSelector = "footer";

    // Pop-up message
    toastContainerSelector = "nv-toaster-container"; // "div[id='toast-container']"
    popUpMessageSelector = "div[id='toast-container']"; // --> this one is ok to check TOAST popUp
    
    notificationTopCenterToaster = "div[id='toast-container'][class^='toast-top-center']"
    notificationBottomLeftToaster = "div[id='toast-container'][class^='toast-bottom-left']"
    shownNotificationBottomLeftToaster = "bo-activity-toaster"
    
    // titleSelector = "div[ng-class='config.title']";
    titleSelector = "div[class*='toast-title']";
    // messageTextSelector = "div[ng-class='config.message'] div[class^='toast-text-']";
    messageTextSelector = "div[class*='toast-message'] div[class^='toast-text']";
    closeButtonSelector = "button[class^='toast-close-button']";
    warningPopUpSelector = "div[class$='toast-warning']"
    successPopUpSelector = "div[class$='toast-success']"

    //Note List View
    noteListViewSelector = "note-list-view"
    noteItemSelector = "easy-list-view-item" // Not used anymore
    viewButtonSelector = "button[title='View']"
    iconSelector = "span[class='title'] i"
    noteTitleSelector = "p"

    // CK Editor
    ckEditorSelector = "ng-ckeditor[id='id']";
    sourceLink = "a[title='Source']";
    textField = "textarea[title]";
    textFieldValue = "textarea[class*='cke_enable_context_menu']";
    

    // Confirmation Dialog
    confirmDialogSelector = "div[role='alertdialog']";// should try to use "*[class$='confirm']";

    // Uploading Progress Bar
    uploadingProgressBar = "div[class^='progress-file-uploading progress'] div[role='progressbar']";

    uploadWidgetSection = "upload-widget[list-file]";
    pendingFile = "div[type='button'][class*='label-warning']";

    // Loading after log in
    spinnerContainer = "bo-root";
    spinner = "div[id='cssload-pgloading']";

    rightPanelSelector = "section[class^='information']";
    inforHeaderSelector = "dt";

    multiSelectDropdownSelector = "multi-select";
    multiSelectDropdownMenuSelector = "ul[class*='dropdown-menu inner'] li";
    multiSelectValueSelector = "ul[class*='dropdown-menu inner'] li > a span[class='text']";

    searchFormSectionSelector = "form[name='searchForm'] div[class*='form-search easy-search-area']";

/****************** Start to refactor the CSS Selector From here *************************************/    
    multiSelectDropdown_InputSelector = "div[class='multiselect-container'] input[type='search']";

    // nv-dropdown multi-select dropdown
    nvDropdownContainer = "nv-dropdown div[class='nv-dropdown-container']";
    nvDropdownPanel = "nv-dropdown-panel[class*='opened']"; //nv-dropdown-panel[class*='nv-dropdown-panel shadow opened']
    nvDropdownPanel_searchTxt = "input[type='text']";
    nvDropdownPanel_options = "div[class^='nv-dropdown-panel-items'] nv-dropdown-option";
    nvDropdownPanel_options_label = "span[class$='nv-dropdown-option-label']";
    nvButton = "nv-button > button";
    nvCheckbox = "nv-inline-checkbox div[class='nv-inline-checkbox'] input[type='checkbox']";

    nvWarningDialog = "nv-warning-dialog";
    nvSearchTag = "nv-search-tag";
    nvTabs = "nv-tabs";
    nvTabItem = "nv-tab-item";
    //nvContextMenu = "nv-context-menu";

    // Context-menu
    contextMenuSelector = "header context-menu"
    contextMenu = "context-menu"
    nvContextMenuContainer = "nv-context-menu-container > ul";
    contextMenuOptions = "nv-context-menu-container li a span"
    nvListView = "nv-list-view";
    nvActionMenu = "nv-action-menu";
    nvMenuItem = "nv-menu-item";
    searchBtn = "nv-button[buttoncommontype='search'] > button"
    resetBtn = "nv-button[buttoncommontype='reset'] > button"
    saveBtn = "nv-button[buttoncommontype='save'] > button"
    closeBtn = "nv-button[buttoncommontype='close'] > button"
    addBtn = "nv-button[buttoncommontype='add'] > button"

    tooltipValidationField = "div[class*='tooltip-validation']"
    nvTooltipWrapper = "nv-tooltip-wrapper"
    exclamation = "i[class*='fa-exclamation']"

    confirmButton = "button[class$='btn-primary']"; // or YES
    closeButton = "button[class$='btn-default']"; // or NO

    noteTaskCounterFromTab = "bo-note-activity-counter";
    attachmentCounterFromTab = "nv-attachment-counter";

    // UIView Section -> Notes / Tasks Tab , There are some objects also defined in UIViewSection.js
    parisNoteListSelector = "bo-paris-note-fixed-list";
    parisActivityListSelector = "bo-paris-activity-fixed-list";
    emptyListSelector = "div[class^='nv-list-view-empty']";
    itemListSelector = "div[class^='nv-list-view-item ']";
    boTextEditorSelector = "bo-text-editor";
    textEditorSelector = "div[class*='editor']";
}