//https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/keyboard.js    gnome osk
//https://github.com/schuhumi/gnome-shell-extension-improve-osk                 original
//https://github.com/dmroduner/gnome-shell-extension-improve-osk                copied fork
//https://gitlab.gnome.org/GNOME/gnome-shell/-/tree/master/data/osk-layouts     default layouts

const St = imports.gi.St;
const Main = imports.ui.main;
const Keyboard = imports.ui.keyboard;
const EdgeDragAction = imports.ui.edgeDragAction;
const Shell = imports.gi.Shell;
const Lang = imports.lang;
const Clutter = imports.gi.Clutter;
const Workspace = imports.ui.workspace
const Tweener = imports.ui.tweener;
const Overview = imports.ui.overview;
const Layout = imports.ui.layout;

var Backup_DefaultKeysForRow;
var Backup_contructor;
var Backup_keyvalPress;
var Backup_keyvalRelease;

const defaultKeysPreMod = [
    [ 
        [{ label: 'Esc', width: 1, keyval: Clutter.KEY_Escape }], 
        [{ label: '↹', width: 1.5, keyval: Clutter.KEY_Tab }], 
        [{ width: 2.5, level: 1, extraClassName: 'shift-key-lowercase', icon: 'keyboard-shift-filled-symbolic' }], 
        [
            { label: 'Ctrl', width: 1, keyval: Clutter.KEY_Control_L, extraClassName: 'control-key' }, 
            { label: 'Alt', width: 1, keyval: Clutter.KEY_Alt_L, extraClassName: 'alt-key' }
        ] 
    ],
    [ 
        [{ label: 'Esc', width: 1, keyval: Clutter.KEY_Escape }], 
        [{ label: '↹', width: 1.5, keyval: Clutter.KEY_Tab }], 
        [{ width: 2.5, level: 0, extraClassName: 'shift-key-uppercase', icon: 'keyboard-shift-filled-symbolic'  }], 
        [
            { label: 'Ctrl', width: 1, keyval: Clutter.KEY_Control_L, extraClassName: 'control-key' }, 
            { label: 'Alt', width: 1, keyval: Clutter.KEY_Alt_L, extraClassName: 'alt-key' }
        ] 
    ],
    [ 
        [{ label: 'Esc', width: 1, keyval: Clutter.KEY_Escape }], 
        [{ label: '↹', width: 1.5, keyval: Clutter.KEY_Tab }], 
        [{ label: '=/<', width: 2.5, level: 3}], 
        [
            { label: 'Ctrl', width: 1, keyval: Clutter.KEY_Control_L, extraClassName: 'control-key' }, 
            { label: 'Alt', width: 1, keyval: Clutter.KEY_Alt_L, extraClassName: 'alt-key' }
        ] 
    ],
    [ 
        [{ label: 'Esc', width: 1, keyval: Clutter.KEY_Escape }], 
        [{ label: '↹', width: 1, keyval: Clutter.KEY_Tab }], 
        [{ label: '?123', width: 1.5, level: 2 }], 
        [
            { label: 'Ctrl', width: 1, keyval: Clutter.KEY_Control_L, extraClassName: 'control-key' }, 
            { label: 'Alt', width: 1, keyval: Clutter.KEY_Alt_L, extraClassName: 'alt-key' }
        ] 
    ]
];

    
const defaultKeysPostMod = [
    [ 
        [
            { width: 1.5, keyval: Clutter.KEY_BackSpace, icon: 'edit-clear-symbolic' }, 
            { action: 'emoji', icon: 'face-smile-symbolic' }
        ], [                
            { width: 2, keyval: Clutter.KEY_Return, extraClassName: 'enter-key', icon: 'keyboard-enter-symbolic' }, 
            { width: 1, action: 'languageMenu', extraClassName: 'layout-key', icon: 'keyboard-layout-filled-symbolic' }
        ], [
            { label: '?123', width: 1, level: 2 },
            { label: '↑', width: 1, keyval: Clutter.KEY_Up }, 
            { width: 2, level: 1, right: true, extraClassName: 'shift-key-lowercase', icon: 'keyboard-shift-filled-symbolic' }
        ], [
            { label: '←', width: 1, keyval: Clutter.KEY_Left }, 
            { label: '↓', width: 1, keyval: Clutter.KEY_Down }, 
            { label: '→', width: 1, keyval: Clutter.KEY_Right }, 
            { width: 1, action: 'hide', extraClassName: 'hide-key', icon: 'go-down-symbolic' }
        ]
    ], [
        [
            { width: 1.5, keyval: Clutter.KEY_BackSpace, icon: 'edit-clear-symbolic' }, 
            { action: 'emoji', icon: 'face-smile-symbolic' }
        ], [
            { width: 2, keyval: Clutter.KEY_Return, extraClassName: 'enter-key' }, 
            { width: 1, action: 'languageMenu', extraClassName: 'layout-key', icon: 'keyboard-layout-filled-symbolic' }
        ], [
            { label: '?123', width: 1, level: 2 },
            { label: '↑', width: 1, keyval: Clutter.KEY_Up }, 
            { width: 2, level: 0, right: true, extraClassName: 'shift-key-uppercase', icon: 'keyboard-shift-filled-symbolic' }
        ], [
            { label: '←', width: 1, keyval: Clutter.KEY_Left }, 
            { label: '↓', width: 1, keyval: Clutter.KEY_Down }, 
            { label: '→', width: 1, keyval: Clutter.KEY_Right }, 
            { width: 1, action: 'hide', extraClassName: 'hide-key', icon: 'go-down-symbolic' }
        ] 
    ], [ 
        [
            { width: 1.5, keyval: Clutter.KEY_BackSpace, icon: 'edit-clear-symbolic' }, 
            { action: 'emoji', icon: 'face-smile-symbolic' }
        ], [
            { width: 2, keyval: Clutter.KEY_Return, extraClassName: 'enter-key', icon: 'keyboard-enter-symbolic' }, 
            { width: 1, action: 'languageMenu', extraClassName: 'layout-key', icon: 'keyboard-layout-filled-symbolic' }
        ], [
            { label: 'ABC', width: 1, level: 0 },
            { label: '↑', width: 1, keyval: Clutter.KEY_Up }, 
            { label: '=/<', width: 2, level: 3, right: true } 
        ], [
            { label: '←', width: 1, keyval: Clutter.KEY_Left }, 
            { label: '↓', width: 1, keyval: Clutter.KEY_Down }, 
            { label: '→', width: 1, keyval: Clutter.KEY_Right }, 
            { width: 1, action: 'hide', extraClassName: 'hide-key', icon: 'go-down-symbolic' }
        ] 
    ], [   
        [
            { label: 'F1', width: 1, keyval: Clutter.KEY_F1 }, 
            { label: 'F2', width: 1, keyval: Clutter.KEY_F2 }, 
            { label: 'F3', width: 1, keyval: Clutter.KEY_F3 }, 
            { width: 1.5, keyval: Clutter.KEY_BackSpace, icon: 'edit-clear-symbolic' }, 
            { width: 1, action: 'hide', extraClassName: 'hide-key', icon: 'go-down-symbolic' }
        ], [
            { label: 'F4', width: 1, keyval: Clutter.KEY_F4 }, 
            { label: 'F5', width: 1, keyval: Clutter.KEY_F5 }, 
            { label: 'F6', width: 1, keyval: Clutter.KEY_F6 }, 
            { width: 2, keyval: Clutter.KEY_Return, extraClassName: 'enter-key', icon: 'keyboard-enter-symbolic' }, 
            { width: 1.5, action: 'languageMenu', extraClassName: 'layout-key', icon: 'keyboard-layout-filled-symbolic' }
        ], [
            { label: 'F7', width: 1, keyval: Clutter.KEY_F7 }, 
            { label: 'F8', width: 1, keyval: Clutter.KEY_F8 }, 
            { label: 'F9', width: 1, keyval: Clutter.KEY_F9 }, 
            { label: '?123', width: 3, level: 2, right: true }, 
            { label: 'ABC', width: 1.5, level: 0 }
        ], [
            { label: 'F10', width: 1, keyval: Clutter.KEY_F10 }, 
            { label: 'F11', width: 1, keyval: Clutter.KEY_F11 }, 
            { label: 'F12', width: 1, keyval: Clutter.KEY_F12 }, 
            { label: '←', width: 1, keyval: Clutter.KEY_Left }, 
            { label: '↑', width: 1, keyval: Clutter.KEY_Up }, 
            { label: '↓', width: 1, keyval: Clutter.KEY_Down }, 
            { label: '→', width: 1, keyval: Clutter.KEY_Right }] 
    ],
];

function init() {
    Backup_DefaultKeysForRow = Keyboard.Keyboard.prototype['_getDefaultKeysForRow'];
    Backup_contructor = Keyboard.KeyboardController.prototype['constructor'];
    Backup_keyvalPress = Keyboard.KeyboardController.prototype['keyvalPress'];
    Backup_keyvalRelease = Keyboard.KeyboardController.prototype['keyvalRelease'];
}

function enable() {
    Main.layoutManager.removeChrome(Main.layoutManager.keyboardBox);

    var KeyboardIsSetup = true;
    try {
      Main.keyboard._destroyKeyboard();
    } catch (e) {
        if(e instanceof TypeError) {
            // In case the keyboard is currently disabled in accessability settings, attempting to _destroyKeyboard() yields a TypeError ("TypeError: this.actor is null")
            // This doesn't affect functionality, so proceed as usual. The only difference is that we do not automatically _setupKeyboard at the end of this enable() (let the user enable the keyboard in accessability settings)
            KeyboardIsSetup = false;
        } else {
            // Something different happened
            throw e;
        }
    }
    
    Keyboard.Keyboard.prototype['_getDefaultKeysForRow'] = function(row, numRows, level) {
        
        /* The first 2 rows in defaultKeysPre/Post belong together with
         * the first 2 rows on each keymap. On keymaps that have more than
         * 4 rows, the last 2 default key rows must be respectively
         * assigned to the 2 last keymap ones.
         */
        if (row < 2) {
            return [defaultKeysPreMod[level][row], defaultKeysPostMod[level][row]];
        } else if (row >= numRows - 2) {
            let defaultRow = row - (numRows - 2) + 2;
            return [defaultKeysPreMod[level][defaultRow], defaultKeysPostMod[level][defaultRow]];
        } else {
            return [null, null];
        }
    }
    
    Keyboard.KeyboardController.prototype['constructor'] = function() {
        let deviceManager = Clutter.DeviceManager.get_default();
        this._virtualDevice = deviceManager.create_virtual_device(Clutter.InputDeviceType.KEYBOARD_DEVICE);

        this._inputSourceManager = InputSourceManager.getInputSourceManager();
        this._sourceChangedId = this._inputSourceManager.connect('current-source-changed',
                                                                 this._onSourceChanged.bind(this));
        this._sourcesModifiedId = this._inputSourceManager.connect ('sources-changed',
                                                                    this._onSourcesModified.bind(this));
        this._currentSource = this._inputSourceManager.currentSource;
        
        this._controlActive = false;
        this._altActive = false;

        Main.inputMethod.connect('notify::content-purpose',
                                 this._onContentPurposeHintsChanged.bind(this));
        Main.inputMethod.connect('notify::content-hints',
                                 this._onContentPurposeHintsChanged.bind(this));
        Main.inputMethod.connect('input-panel-state', (o, state) => {
            this.emit('panel-state', state);
        });
    }

    
    Keyboard.KeyboardController.prototype['keyvalPress'] = function(keyval) {
        if(keyval==Clutter.KEY_Control_L) {
            this._controlActive = !this._controlActive; // This allows to revert an accidental tap on Ctrl by tapping on it again
        }
        if(keyval==Clutter.KEY_Alt_L) {
            this._altActive = !this._altActive;
        }
        
        if(this._controlActive)
        {
            this._virtualDevice.notify_keyval(Clutter.get_current_event_time(),
                                              Clutter.KEY_Control_L, Clutter.KeyState.PRESSED);
            Main.layoutManager.keyboardBox.add_style_class_name("control-key-latched");
        } else {
            this._virtualDevice.notify_keyval(Clutter.get_current_event_time(),
                                              Clutter.KEY_Control_L, Clutter.KeyState.RELEASED);
            Main.layoutManager.keyboardBox.remove_style_class_name("control-key-latched");
        }
        if(this._altActive)
        {
            this._virtualDevice.notify_keyval(Clutter.get_current_event_time(),
                                              Clutter.KEY_Alt_L, Clutter.KeyState.PRESSED);
            Main.layoutManager.keyboardBox.add_style_class_name("alt-key-latched");
        } else {
            this._virtualDevice.notify_keyval(Clutter.get_current_event_time(),
                                              Clutter.KEY_Alt_L, Clutter.KeyState.RELEASED);
            Main.layoutManager.keyboardBox.remove_style_class_name("alt-key-latched");
        }
        this._virtualDevice.notify_keyval(Clutter.get_current_event_time(),
                                          keyval, Clutter.KeyState.PRESSED);
    }

    
    Keyboard.KeyboardController.prototype['keyvalRelease'] = function(keyval) {
        if(keyval==Clutter.KEY_Control_L || keyval==Clutter.KEY_Alt_L ) {
            return;
        }
        
        this._virtualDevice.notify_keyval(Clutter.get_current_event_time(),
                                          keyval, Clutter.KeyState.RELEASED);

        if(this._controlActive)
        {
            this._virtualDevice.notify_keyval(Clutter.get_current_event_time(),
                                              Clutter.KEY_Control_L, Clutter.KeyState.RELEASED);
            this._controlActive = false;
            Main.layoutManager.keyboardBox.remove_style_class_name("control-key-latched");
        }
        if(this._altActive)
        {
            this._virtualDevice.notify_keyval(Clutter.get_current_event_time(),
                                              Clutter.KEY_Alt_L, Clutter.KeyState.RELEASED);
            this._altActive = false;
            Main.layoutManager.keyboardBox.remove_style_class_name("alt-key-latched");
        }

    }

    if(KeyboardIsSetup) {
        Main.keyboard._setupKeyboard();
    }
    Main.layoutManager.addChrome(Main.layoutManager.keyboardBox);
}

function disable() {
    Main.layoutManager.removeChrome(Main.layoutManager.keyboardBox);
    
    var KeyboardIsSetup = true;
    try {
      Main.keyboard._destroyKeyboard();
    } catch (e) {
        if(e instanceof TypeError) {
            // In case the keyboard is currently disabled in accessability settings, attempting to _destroyKeyboard() yields a TypeError ("TypeError: this.actor is null")
            // This doesn't affect functionality, so proceed as usual. The only difference is that we do not automatically _setupKeyboard at the end of this enable() (let the user enable the keyboard in accessability settings)
            KeyboardIsSetup = false;
        } else {
            // Something different happened
            throw e;
        }
    }
    
    Keyboard.Keyboard.prototype['_getDefaultKeysForRow'] = Backup_DefaultKeysForRow;
    Keyboard.KeyboardController.prototype['constructor'] = Backup_contructor;
    Keyboard.KeyboardController.prototype['keyvalPress'] = Backup_keyvalPress;
    Keyboard.KeyboardController.prototype['keyvalRelease'] = Backup_keyvalRelease;
    if(KeyboardIsSetup) {
        Main.keyboard._setupKeyboard();
    }
    Main.layoutManager.addChrome(Main.layoutManager.keyboardBox);
}
