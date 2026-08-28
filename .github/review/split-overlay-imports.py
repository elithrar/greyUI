from pathlib import Path
import re

path = Path("docs/src/main.tsx")
source = path.read_text()
pattern = re.compile(
    r'              <Demo\n                title="Interactive overlays"[\s\S]*?              </Demo>',
)
replacement = '''              <div className="docs-grid-2 docs-component-grid">
                <Demo title="Menu and tooltip" imports={["Menu", "Tooltip"]}>
                  <div className="docs-row">
                    <Menu.Root>
                      <Menu.Trigger>Actions</Menu.Trigger>
                      <Menu.Popup>
                        <Menu.Item>Open</Menu.Item>
                        <Menu.Item>Duplicate</Menu.Item>
                        <Menu.Separator />
                        <Menu.Item>Properties…</Menu.Item>
                      </Menu.Popup>
                    </Menu.Root>

                    <Tooltip.Root>
                      <Tooltip.Trigger className="greyui-button">Hover me</Tooltip.Trigger>
                      <Tooltip.Popup>Tooltip</Tooltip.Popup>
                    </Tooltip.Root>
                  </div>
                </Demo>

                <Demo title="Popover" imports={["Popover"]}>
                  <Popover.Root>
                    <Popover.Trigger>Details…</Popover.Trigger>
                    <Popover.Popup
                      title="Build information"
                      description="Base UI handles popover behavior; greyUI supplies the theme."
                    >
                      <Popover.Close className="greyui-button" type="button">
                        Close
                      </Popover.Close>
                    </Popover.Popup>
                  </Popover.Root>
                </Demo>

                <Demo title="Dialogs" imports={["AlertDialog", "Dialog", "Layer"]}>
                  <div className="docs-row">
                    <Dialog.Root>
                      <Dialog.Trigger>Open dialog…</Dialog.Trigger>
                      <Dialog.Popup title="Enable edit mode" description="Apply to save the changes.">
                        <div className="docs-dialog-actions">
                          <Dialog.Close className="greyui-button">Cancel</Dialog.Close>
                          <Dialog.Close className="greyui-button" data-variant="primary">
                            Enable edits
                          </Dialog.Close>
                        </div>
                      </Dialog.Popup>
                    </Dialog.Root>

                    <AlertDialog.Root>
                      <AlertDialog.Trigger>Discard…</AlertDialog.Trigger>
                      <AlertDialog.Popup
                        title="Discard changes?"
                        description="This action cannot be undone."
                      >
                        <div className="docs-dialog-actions">
                          <AlertDialog.Close className="greyui-button">
                            Keep editing
                          </AlertDialog.Close>
                          <AlertDialog.Close className="greyui-button" data-variant="destructive">
                            Discard
                          </AlertDialog.Close>
                        </div>
                      </AlertDialog.Popup>
                    </AlertDialog.Root>
                  </div>
                </Demo>
              </div>'''
source, count = pattern.subn(replacement, source, count=1)
if count != 1:
    raise RuntimeError(f"Expected one Interactive overlays demo, replaced {count}")
path.write_text(source)
