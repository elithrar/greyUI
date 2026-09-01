import { Accordion, Autocomplete, Checkbox, CheckboxGroup, Fieldset, ToggleGroup } from "../../src";

const suggestions = ["BeOS R5", "Haiku", "Zeta", "NewOS"];

function ComponentDemo({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <article className="docs-high-value-demo">
      <div className="docs-high-value-demo-header">
        <h3>{name}</h3>
      </div>
      <div className="docs-high-value-demo-canvas">{children}</div>
    </article>
  );
}

export function HighValueComponentDemos() {
  return (
    <div className="docs-high-value-grid">
      <ComponentDemo name="ToggleGroup">
        <ToggleGroup.Root aria-label="Editor options" defaultValue={["grid"]}>
          <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
          <ToggleGroup.Item value="snap">Snap</ToggleGroup.Item>
          <ToggleGroup.Item value="guides">Guides</ToggleGroup.Item>
          <ToggleGroup.Item value="locked" disabled>
            Locked
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </ComponentDemo>

      <ComponentDemo name="Autocomplete">
        <div className="docs-high-value-stack">
          <Autocomplete.Root items={suggestions}>
            <Autocomplete.InputGroup>
              <Autocomplete.Input aria-label="Operating system" placeholder="Type any value…" />
              <Autocomplete.Clear />
              <Autocomplete.Trigger />
            </Autocomplete.InputGroup>
            <Autocomplete.Popup>
              <Autocomplete.Empty>No matching suggestion</Autocomplete.Empty>
              <Autocomplete.List>
                {(item: string) => (
                  <Autocomplete.Item key={item} value={item}>
                    {item}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Root>
          <small>Suggestions assist entry; free-form values remain valid.</small>
        </div>
      </ComponentDemo>

      <ComponentDemo name="Accordion">
        <Accordion.Root defaultValue={["general"]}>
          <Accordion.Item value="general">
            <Accordion.Header>
              <Accordion.Trigger>General</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Basic application settings.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="advanced">
            <Accordion.Header>
              <Accordion.Trigger>Advanced</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Cache, indexing, and integration settings.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="managed" disabled>
            <Accordion.Header>
              <Accordion.Trigger>Managed</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Managed by policy.</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      </ComponentDemo>

      <ComponentDemo name="CheckboxGroup">
        <CheckboxGroup aria-label="Build output" defaultValue={["symbols"]}>
          <Checkbox value="symbols" label="Debug symbols" />
          <Checkbox value="map" label="Source map" />
          <Checkbox value="listing" label="Assembly listing" />
        </CheckboxGroup>
      </ComponentDemo>

      <ComponentDemo name="Fieldset">
        <div className="docs-fieldset-pair">
          <Fieldset.Root>
            <Fieldset.Legend>Build output</Fieldset.Legend>
            <CheckboxGroup aria-label="Enabled build output" defaultValue={["symbols"]}>
              <Checkbox value="symbols" label="Debug symbols" />
              <Checkbox value="map" label="Source map" />
            </CheckboxGroup>
          </Fieldset.Root>
          <Fieldset.Root disabled>
            <Fieldset.Legend>Managed settings</Fieldset.Legend>
            <CheckboxGroup aria-label="Managed settings">
              <Checkbox value="policy" label="Enforce policy" />
            </CheckboxGroup>
          </Fieldset.Root>
          <Fieldset.Root variant="plain" aria-label="Export options">
            <CheckboxGroup aria-label="Export options" defaultValue={["metadata"]}>
              <Checkbox value="metadata" label="Include metadata" />
              <Checkbox value="preview" label="Generate preview" />
            </CheckboxGroup>
          </Fieldset.Root>
        </div>
      </ComponentDemo>
    </div>
  );
}
