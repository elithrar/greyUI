import { Select as SubpathSelect } from "greyui/components/select";
import { Autocomplete as SubpathAutocomplete } from "greyui/components/autocomplete";
import type { SelectProps } from "greyui";
import { createRef } from "react";
import { expectTypeOf } from "vitest";
import {
  Accordion,
  ToggleGroup,
  AlertDialog,
  Autocomplete,
  Dialog,
  Popover,
  RadioGroup,
  Select,
  Slider,
} from "greyui";

const toggleValues: ("grid" | "snap")[] = ["grid"];
const multipleProps: SelectProps = {
  label: "Themes",
  multiple: true,
  value: ["beos"],
  options: [],
};
const options = [{ value: "beos", label: "BeOS" }];

// Consumer contracts: compiled by typecheck, never mounted by the test runner.
export const componentApiExamples = (
  <>
    <Select {...multipleProps} />
    <SubpathSelect
      label="Theme"
      options={options}
      onValueChange={(value) => {
        expectTypeOf(value).toEqualTypeOf<string | null>();
      }}
    />
    <SubpathAutocomplete.Root items={[{ id: "beos" }]} itemToStringValue={(item) => item.id} />
    <Accordion.Root
      defaultValue={["general"]}
      onValueChange={(value) => {
        expectTypeOf(value).toEqualTypeOf<string[]>();
      }}
    />
    <ToggleGroup.Root
      value={toggleValues}
      onValueChange={(value) => {
        expectTypeOf(value).toEqualTypeOf<("grid" | "snap")[]>();
      }}
    />
    <Select
      label="Theme"
      options={options}
      onValueChange={(value) => {
        expectTypeOf(value).toEqualTypeOf<string | null>();
      }}
    />
    <Select
      label="Themes"
      options={options}
      multiple
      onValueChange={(value) => {
        expectTypeOf(value).toEqualTypeOf<string[]>();
      }}
    />
    <Select
      label="Theme"
      options={options}
      value="beos"
      onValueChange={(value: string | null) => void value}
    />
    {/* @ts-expect-error Select options have string values. */}
    <Select label="Theme" options={options} value={123} />
    {/* @ts-expect-error Single selection cannot receive an array. */}
    <Select label="Theme" options={options} value={["beos"]} />
    {/* @ts-expect-error Multiple selection requires an array. */}
    <Select label="Themes" options={options} multiple value="beos" />
    <Slider.Root
      defaultValue={40}
      ref={createRef<HTMLDivElement>()}
      onValueChange={(value) => {
        expectTypeOf(value).toEqualTypeOf<number>();
      }}
    />
    <Slider.Root
      defaultValue={[20, 80]}
      onValueCommitted={(value) => {
        expectTypeOf(value).toEqualTypeOf<number[]>();
      }}
    />
    <RadioGroup
      options={options}
      onValueChange={(value) => {
        expectTypeOf(value).toEqualTypeOf<string>();
      }}
    />
    {/* @ts-expect-error RadioGroup renders string-valued options. */}
    <RadioGroup options={options} value={123} />
    <Dialog.Popup title={<span>Dialog title</span>} />
    <AlertDialog.Popup title={<span>Alert title</span>} />
    <Popover.Popup title={<span>Popover title</span>} />
    <Autocomplete.Root
      items={[{ label: "Systems", items: [{ id: "beos", name: "BeOS" }] }]}
      itemToStringValue={(item) => item.name}
      onItemHighlighted={(item) => {
        expectTypeOf(item).toEqualTypeOf<{ id: string; name: string } | undefined>();
      }}
    />
  </>
);
