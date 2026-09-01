import {
  Button,
  Checkbox,
  Field,
  Fieldset,
  Input,
  Select,
  StatusBar,
  StatusBarItem,
  StatusLight,
  Table,
  Window,
} from "../../src";

const presets = [
  { value: "915-61", label: "Porsche 915/61" },
  { value: "915-63", label: "Porsche 915/63" },
];

const gears = [
  { label: "Gear 1", value: "11:35" },
  { label: "Gear 2", value: "18:33" },
  { label: "Gear 3", value: "23:29" },
  { label: "Gear 4", value: "26:26" },
  { label: "Gear 5", value: "29:22" },
  { label: "Gear 6", value: "" },
];

export function DenseWindowExample() {
  return (
    <Window title="Gearset" responsive="stacked" className="docs-dense-window">
      <Window.Content>
        <Window.Header>
          <Window.Description>
            Configure the transmission and its operating limits. The description and controls share
            the same content rails as the grouped fields below.
          </Window.Description>
          <Window.Actions>
            <Field.ActionRow>
              <Select label="Preset" defaultValue="915-61" options={presets} />
              <Button type="button">Copy link</Button>
            </Field.ActionRow>
          </Window.Actions>
        </Window.Header>

        <Fieldset.Root variant="plain" aria-label="Transmission gears">
          <div className="docs-dense-fieldset-heading">
            <div>
              <strong>Tooth counts</strong>
              <p>Enter driving:driven pairs. Sixth gear is optional.</p>
            </div>
            <Checkbox label="Use direct ratios" />
          </div>
          <div className="docs-dense-field-grid">
            {gears.map((gear) => (
              <label className="docs-field" key={gear.label}>
                <span>{gear.label}</span>
                <Input
                  defaultValue={gear.value}
                  placeholder={gear.value === "" ? "Optional" : undefined}
                />
              </label>
            ))}
          </div>
        </Fieldset.Root>

        <Table aria-label="Calculated gear speeds">
          <thead>
            <tr>
              <th>Gear</th>
              <th>Ratio</th>
              <th>Speed</th>
              <th>RPM drop</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1st</td>
              <td>3.182</td>
              <td>43 mph</td>
              <td>—</td>
            </tr>
            <tr>
              <td>2nd</td>
              <td>1.833</td>
              <td>75 mph</td>
              <td>3,353</td>
            </tr>
          </tbody>
        </Table>
      </Window.Content>
      <StatusBar>
        <StatusBarItem grow>URL-compatible teeth and direct-ratio input</StatusBarItem>
        <StatusLight state="ready" label="Gearset ready" />
      </StatusBar>
    </Window>
  );
}

export const denseWindowCode = `<Window title="Gearset" responsive="stacked">
  <Window.Content>
    <Window.Header>
      <Window.Description>Configure the transmission.</Window.Description>
      <Window.Actions>
        <Field.ActionRow>
          <Select label="Preset" options={presets} />
          <Button>Copy link</Button>
        </Field.ActionRow>
      </Window.Actions>
    </Window.Header>

    <Fieldset.Root variant="plain" aria-label="Transmission gears">
      {/* grouped inputs and content */}
    </Fieldset.Root>
    <Table>{/* results */}</Table>
  </Window.Content>
  <StatusBar>Ready</StatusBar>
</Window>`;
