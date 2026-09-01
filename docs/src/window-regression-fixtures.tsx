import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Button, Field, Menu, Select, Window } from "../../src";

export const WINDOW_REGRESSION_WIDTHS = [280, 320, 360, 520, 640, 760, 820] as const;

const themes = [
  { value: "beos", label: "BeOS R5" },
  { value: "workbench", label: "Workbench with a deliberately long option label" },
];

interface RegressionCaseProps {
  children: ReactNode;
  label: string;
  state: "active" | "inactive" | "collapsed";
  width: (typeof WINDOW_REGRESSION_WIDTHS)[number];
}

function RegressionCase({ children, label, state, width }: RegressionCaseProps) {
  const style: CSSProperties & { "--docs-regression-width": string } = {
    "--docs-regression-width": `${width}px`,
  };

  return (
    <figure
      className="docs-window-regression-case"
      data-regression-case="window"
      data-regression-state={state}
      data-regression-width={width}
      style={style}
    >
      <figcaption>
        <strong>{width}px container</strong>
        <span>{label}</span>
      </figcaption>
      {children}
    </figure>
  );
}

interface RegressionContentProps {
  actionLayout?: "auto" | "inline" | "stacked";
  compact?: boolean;
  headerLayout?: "auto" | "inline" | "stacked";
}

function RegressionContent({
  actionLayout = "auto",
  compact = false,
  headerLayout = "auto",
}: RegressionContentProps) {
  return (
    <Window.Content density={compact ? "compact" : "comfortable"} data-regression-contained>
      <Window.Header layout={headerLayout} data-regression-contained>
        <Window.Description>
          Resize the containing panel without changing the browser viewport.
        </Window.Description>
        <Window.Actions data-regression-contained>
          <Field.ActionRow layout={actionLayout} data-regression-contained>
            <Select label="Theme" defaultValue="beos" options={themes} />
            <Button type="button">Apply</Button>
          </Field.ActionRow>
        </Window.Actions>
      </Window.Header>
    </Window.Content>
  );
}

export function WindowRegressionFixtures() {
  const suiteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const suite = suiteRef.current;
    if (suite === null) return;

    const runProbe = () => {
      const failures = collectWindowRegressionGeometryFailures(suite);
      suite.dataset.regressionGeometry = failures.length === 0 ? "passed" : "failed";
      if (failures.length === 0) {
        delete suite.dataset.regressionFailures;
      } else {
        suite.dataset.regressionFailures = failures.join("\n");
      }
    };
    runProbe();

    const ResizeObserverClass = window.ResizeObserver;
    const resizeObserver = ResizeObserverClass ? new ResizeObserverClass(runProbe) : null;
    resizeObserver?.observe(suite);
    for (const frame of suite.querySelectorAll<HTMLElement>("[data-regression-frame='window']")) {
      resizeObserver?.observe(frame);
    }

    const menuLayer = suite.ownerDocument.querySelector("[data-greyui-layer='menu']");
    const mutationObserver = menuLayer === null ? null : new MutationObserver(runProbe);
    if (mutationObserver !== null && menuLayer !== null) {
      mutationObserver.observe(menuLayer, { childList: true, subtree: true });
    }
    window.addEventListener("resize", runProbe);

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener("resize", runProbe);
    };
  }, []);

  return (
    <div
      ref={suiteRef}
      className="docs-window-regression-grid"
      data-regression-suite="window-containers"
    >
      <RegressionCase width={280} state="active" label="Smallest expanded automatic window">
        <Window title="Compact utility" data-regression-frame="window">
          <RegressionContent compact />
          <Window.StatusBar data-regression-contained>Ready</Window.StatusBar>
        </Window>
      </RegressionCase>

      <RegressionCase width={320} state="collapsed" label="Collapsed automatic title chrome">
        <Window.Root defaultCollapsed data-regression-frame="window">
          <Window.TitleBar data-regression-contained>
            <Window.Title>Collapsed utility</Window.Title>
            <Window.Controls>
              <Window.Collapse />
            </Window.Controls>
          </Window.TitleBar>
          <Window.Body data-regression-contained>
            <RegressionContent compact />
          </Window.Body>
        </Window.Root>
      </RegressionCase>

      <RegressionCase width={360} state="active" label="Menu, actions, status, and edge popup">
        <Window title="Route inspector" collapsible data-regression-frame="window">
          <Window.MenuBar data-regression-contained>
            <Menu.Root>
              <Menu.Trigger>File</Menu.Trigger>
              <Menu.Popup
                positionerProps={{ align: "end" }}
                data-regression-overlay
                data-regression-overlay-width="content"
              >
                <Menu.Item>Open a deliberately long recent route from the left edge</Menu.Item>
                <Menu.Item>Close</Menu.Item>
              </Menu.Popup>
            </Menu.Root>
            <Menu.Root>
              <Menu.Trigger className="docs-window-regression-edge-trigger">Window</Menu.Trigger>
              <Menu.Popup data-regression-overlay data-regression-overlay-width="content">
                <Menu.Item>Move this window to the opposite edge</Menu.Item>
                <Menu.Item>Minimize</Menu.Item>
              </Menu.Popup>
            </Menu.Root>
          </Window.MenuBar>
          <RegressionContent compact />
          <Window.StatusBar data-regression-contained>
            <Window.StatusBar.Item grow>Ready</Window.StatusBar.Item>
            <Window.StatusBar.Light state="ready" label="Route inspector ready" />
          </Window.StatusBar>
        </Window>
      </RegressionCase>

      <RegressionCase width={520} state="inactive" label="Inactive frame and dense action rail">
        <Window title="Inactive settings" active={false} data-regression-frame="window">
          <RegressionContent headerLayout="stacked" actionLayout="inline" />
          <Window.StatusBar data-regression-contained>Changes saved</Window.StatusBar>
        </Window>
      </RegressionCase>

      <RegressionCase width={640} state="active" label="Explicit floating chrome">
        <Window title="Floating utility" chrome="floating" data-regression-frame="window">
          <RegressionContent compact />
          <Window.StatusBar data-regression-contained>Floating layout</Window.StatusBar>
        </Window>
      </RegressionCase>

      <RegressionCase width={760} state="active" label="Explicit stacked chrome and action row">
        <Window title="Application window" chrome="stacked" data-regression-frame="window">
          <Window.MenuBar data-regression-contained>
            <Menu.Root>
              <Menu.Trigger>File</Menu.Trigger>
              <Menu.Popup data-regression-overlay data-regression-overlay-width="content">
                <Menu.Item>New document</Menu.Item>
                <Menu.Item>Close</Menu.Item>
              </Menu.Popup>
            </Menu.Root>
            <Menu.Root>
              <Menu.Trigger>Edit</Menu.Trigger>
              <Menu.Popup data-regression-overlay data-regression-overlay-width="content">
                <Menu.Item>Undo</Menu.Item>
                <Menu.Item>Redo</Menu.Item>
              </Menu.Popup>
            </Menu.Root>
          </Window.MenuBar>
          <RegressionContent headerLayout="inline" actionLayout="stacked" />
          <Window.StatusBar data-regression-contained>
            <Window.StatusBar.Item grow>2 items</Window.StatusBar.Item>
            <Window.StatusBar.Light state="ready" label="Application ready" />
          </Window.StatusBar>
        </Window>
      </RegressionCase>

      <RegressionCase width={820} state="active" label="Automatic chrome above the breakpoint">
        <Window title="Wide automatic window" data-regression-frame="window">
          <RegressionContent />
          <Window.StatusBar data-regression-contained>Wide layout</Window.StatusBar>
        </Window>
      </RegressionCase>
    </div>
  );
}

interface GeometryOptions {
  documentClientWidth?: number;
  documentScrollWidth?: number;
  viewportHeight?: number;
  viewportWidth?: number;
}

/**
 * Browser-level regression probe for the fixture above. Tests can supply document metrics because
 * jsdom has no layout engine; rendered checks should use the defaults.
 */
export function collectWindowRegressionGeometryFailures(
  root: HTMLElement,
  options: GeometryOptions = {},
) {
  const failures: string[] = [];
  const documentElement = root.ownerDocument.documentElement;
  const documentClientWidth = options.documentClientWidth ?? documentElement.clientWidth;
  const documentScrollWidth = options.documentScrollWidth ?? documentElement.scrollWidth;
  const viewportWidth = options.viewportWidth ?? documentClientWidth;
  const viewportHeight = options.viewportHeight ?? window.innerHeight;

  if (documentScrollWidth > documentClientWidth) {
    failures.push(
      `document overflow: scroll width ${documentScrollWidth}px exceeds ${documentClientWidth}px`,
    );
  }

  for (const fixture of root.querySelectorAll<HTMLElement>("[data-regression-case='window']")) {
    const frame = fixture.querySelector<HTMLElement>("[data-regression-frame='window']");
    if (frame === null) {
      failures.push(`missing frame for ${fixture.dataset.regressionWidth ?? "unknown"}px fixture`);
      continue;
    }

    const frameRect = frame.getBoundingClientRect();
    for (const child of frame.querySelectorAll<HTMLElement>(WINDOW_CONTAINMENT_SELECTOR)) {
      if (child.hidden || child.closest("[hidden]") !== null) continue;
      const childRect = child.getBoundingClientRect();
      if (childRect.left < frameRect.left - 1 || childRect.right > frameRect.right + 1) {
        failures.push(
          `${fixture.dataset.regressionWidth ?? "unknown"}px fixture: ${describeNode(child)} escapes the frame`,
        );
      }
    }
  }

  for (const overlay of root.ownerDocument.querySelectorAll<HTMLElement>(
    "[data-regression-overlay]",
  )) {
    const overlayRect = overlay.getBoundingClientRect();
    if (
      overlayRect.left < 0 ||
      overlayRect.right > viewportWidth ||
      overlayRect.top < 0 ||
      overlayRect.bottom > viewportHeight
    ) {
      failures.push(`${describeNode(overlay)} escapes the viewport`);
    }
  }

  return failures;
}

const WINDOW_CONTAINMENT_SELECTOR = [
  "[data-regression-contained]",
  ".greyui-window-tab",
  ".greyui-window-body",
  ".greyui-menubar",
  ".greyui-window-content",
  ".greyui-window-header",
  ".greyui-window-actions",
  ".greyui-field-action-row",
  ".greyui-field-action-row-layout > *",
  ".greyui-statusbar",
].join(",");

function describeNode(node: HTMLElement) {
  const component = node.getAttribute("data-greyui-component");
  const firstClass = node.className.split(" ")[0];
  return component ?? (firstClass || node.tagName);
}
