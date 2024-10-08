/* extension.js
*
* This program is free software: you can redistribute it and / or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.If not, see http://www.gnu.org/licenses/.
* SPDX - License - Identifier: GPL - 3.0 - or - later
*
* /
/* exported init */

import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';
import St from 'gi://St';
import Pango from 'gi://Pango';
import { panel } from 'resource:///org/gnome/shell/ui/main.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';


export default class Reboot2WinExtension extends Extension {
    menu;
    reboot2WinItem;
    /** @type {number} */
    counter;
    /** @type {number} */
    counterIntervalId;
    /** @type {number} */
    messageIntervalId;
    sourceId;

    _modifySystemItem() {
        this.menu = panel.statusArea.quickSettings._system?.quickSettingsItems[0].menu;


        this.reboot2WinItem = new PopupMenu.PopupMenuItem(`${_('Reboot2Win')}...`);

        this.reboot2WinItem.connect('activate', () => {
            this.counter = 5;

            const dialog = this._buildDialog();
            dialog.open();

            this.counterIntervalId = setInterval(() => {
                if (this.counter > 0) {
                    this.counter--;

                } else {
                    this._clearIntervals();
                    this._reboot();
                }
            }, 1000);

        });

        this.menu.addMenuItem(this.reboot2WinItem, 2);
    }

    async _reboot() {

        try {
            const file = Gio.File.new_for_path('/boot/grub/grub.cfg');
            const [_, contents, etag] = await file.load_contents(null);
            const decoder = new TextDecoder('utf-8');
            const contentsString = decoder.decode(contents);

            const windowsTitle = _getWindowsTitle(contentsString);
            if (!windowsTitle) return;
            const grubRebootSh = [
                'pkexec', 'sh',
                '-c', `grub-reboot "${windowsTitle}" && reboot`
            ]
            execCheck(grubRebootSh).catch((e) => { console.log(e); });
        } catch (error) {
            console.log(error);
        }


    }

    _queueModifySystemItem() {
        this.sourceId = GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
            if (!panel.statusArea.quickSettings._system)
                return GLib.SOURCE_CONTINUE;

            this._modifySystemItem();
            return GLib.SOURCE_REMOVE;
        });
    }

    constructor(metadata) {
        super(metadata);
    }

    enable() {
        if (!panel.statusArea.quickSettings._system) {
            this._queueModifySystemItem();
        } else {
            this._modifySystemItem();
        }
    }

    disable() {
        this._clearIntervals();
        this.reboot2WinItem?.destroy();
        this.reboot2WinItem = null;
        if (this.sourceId) {
            GLib.Source.remove(this.sourceId);
            this.sourceId = null;
        }
    }

    _buildDialog() {
        const dialog = new ModalDialog.ModalDialog({ styleClass: "modal-dialog" });
        dialog.setButtons([
            {
                label: _("Cancel"),
                action: () => {
                    this._clearIntervals();
                    dialog.close();
                },
                key: Clutter.KEY_Escape,
                default: false,
            },
            {
                label: _("Reboot"),
                action: () => {
                    this._clearIntervals();
                    this._reboot();
                },
                default: false,
            },
        ]);

        const dialogTitle = new St.Label({
            text: _('Reboot to Windows'),
            style: "font-weight: bold;font-size:18px"
        });

        let dialogMessage = new St.Label({
            text: this._getDialogMessageText(),
        });
        dialogMessage.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
        dialogMessage.clutter_text.line_wrap = true;

        const titleBox = new St.BoxLayout({
            x_align: Clutter.ActorAlign.CENTER,
        });
        titleBox.add_child(new St.Label({ text: '  ' }));
        titleBox.add_child(dialogTitle);

        let box = new St.BoxLayout({ y_expand: true, vertical: true });
        box.add_child(titleBox);
        box.add_child(new St.Label({ text: '  ' }));
        box.add_child(dialogMessage);

        this.messageIntervalId = setInterval(() => {
            dialogMessage?.set_text(this._getDialogMessageText());
        }, 500);

        dialog.contentLayout.add_child(box);

        return dialog;
    }

    _getDialogMessageText() {
        return _(`The system will restart to Windows in %d seconds. .`).replace('%d', this.counter);
    }

    _clearIntervals() {
        clearInterval(this.counterIntervalId);
        clearInterval(this.messageIntervalId);
    }

}

function _getWindowsTitle(grubConfig) {
    const lines = grubConfig.split('\n');

    const windowsLine = lines.find(line =>
        line.toLowerCase().includes('windows')
    );

    if (!windowsLine) {
        return null; 
    }
    const match = windowsLine.match(/'([^']+)'/);
    return match ? match[1] : null;
}



/**
 * Execute a command asynchronously and check the exit status.
 *
 * If given, @cancellable can be used to stop the process before it finishes.
 *
 * @param {string[]} argv - a list of string arguments
 * @param {Gio.Cancellable} [cancellable] - optional cancellable object
 * @returns {Promise<boolean>} - The process success
 */
async function execCheck(argv, cancellable = null) {
    let cancelId = 0;
    const proc = new Gio.Subprocess({
        argv,
        flags: Gio.SubprocessFlags.NONE,
    });
    proc.init(cancellable);

    if (cancellable instanceof Gio.Cancellable)
        cancelId = cancellable.connect(() => proc.force_exit());

    try {
        const success = await proc.wait_check_async(null);

        if (!success) {
            const status = proc.get_exit_status();

            throw new Gio.IOErrorEnum({
                code: Gio.IOErrorEnum.FAILED,
                message: `Command '${argv}' failed with exit code ${status}`,
            });
        }
    } finally {
        if (cancelId > 0)
            cancellable.disconnect(cancelId);
    }
}