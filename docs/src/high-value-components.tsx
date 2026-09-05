import {
  Accordion,
  Autocomplete,
  Checkbox,
  CheckboxGroup,
  Fieldset,
  Switch,
  ToggleGroup,
} from "../../src";

const suggestions = [
  {
    label: "BeOS family",
    items: [
      { id: "beos", name: "BeOS R5" },
      { id: "haiku", name: "Haiku" },
    ],
  },
  {
    label: "Related systems",
    items: [
      { id: "zeta", name: "Zeta" },
      { id: "newos", name: "NewOS" },
    ],
  },
];

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
        <small>Value arrays preserve their string union in onValueChange.</small>
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
          <Autocomplete.Root items={suggestions} itemToStringValue={(item) => item.name}>
            <Autocomplete.InputGroup>
              <Autocomplete.Input aria-label="Operating system" placeholder="Type any value…" />
              <Autocomplete.Clear />
              <Autocomplete.Trigger />
            </Autocomplete.InputGroup>
            <Autocomplete.Popup width="content">
              <Autocomplete.Empty>No matching suggestion</Autocomplete.Empty>
              <Autocomplete.List>
                {(group: (typeof suggestions)[number]) => (
                  <Autocomplete.Group key={group.label} items={group.items}>
                    <Autocomplete.GroupLabel>{group.label}</Autocomplete.GroupLabel>
                    <Autocomplete.Collection>
                      {(item: (typeof group.items)[number]) => (
                        <Autocomplete.Item key={item.id} value={item}>
                          <Autocomplete.ItemText>{item.name}</Autocomplete.ItemText>
                          <Autocomplete.ItemIndicator />
                        </Autocomplete.Item>
                      )}
                    </Autocomplete.Collection>
                  </Autocomplete.Group>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Root>
          <small>
            Grouped items infer the item type in callbacks; free-form values remain valid.
          </small>
        </div>
      </ComponentDemo>

      <ComponentDemo name="Accordion">
        <small>onValueChange follows the type of value or defaultValue.</small>
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
              <Switch label="Managed autosave" disabled={false} />
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
