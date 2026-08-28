import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { IconButton } from "./button";

export interface PaginationLabels {
  firstPage: string;
  previousPage: string;
  nextPage: string;
  lastPage: string;
  pageNumber: string;
  pageSize: string;
}

const defaultLabels: PaginationLabels = {
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  pageNumber: "Page number",
  pageSize: "Items per page",
};

const defaultPageSizes = [25, 50, 100, 250] as const;

export interface PaginationInfoValue {
  page: number;
  pageShowingRange: string;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

interface PaginationContextValue extends PaginationInfoValue {
  controls: "full" | "simple";
  labels: PaginationLabels;
  setPage: (page: number) => void;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePaginationContext(component: string) {
  const context = useContext(PaginationContext);
  if (context === null) throw new Error(`${component} must be used inside Pagination`);
  return context;
}

type PaginationInfoRenderer = (value: PaginationInfoValue) => ReactNode;

export interface PaginationProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> {
  page: number;
  setPage: (page: number) => void;
  perPage: number;
  totalCount: number;
  controls?: "full" | "simple";
  labels?: Partial<PaginationLabels>;
  text?: ReactNode | PaginationInfoRenderer;
  children?: ReactNode;
}

function paginationValues(page: number, perPage: number, totalCount: number) {
  const safePerPage = Math.max(1, perPage);
  const safeTotal = Math.max(0, totalCount);
  const totalPages = Math.max(1, Math.ceil(safeTotal / safePerPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const first = safeTotal === 0 ? 0 : (safePage - 1) * safePerPage + 1;
  const last = Math.min(safePage * safePerPage, safeTotal);
  return {
    page: safePage,
    pageShowingRange: `${first}–${last}`,
    perPage: safePerPage,
    totalCount: safeTotal,
    totalPages,
  };
}

export function PaginationRoot({
  children,
  className = "",
  controls = "full",
  labels,
  page,
  perPage,
  setPage,
  text,
  totalCount,
  ...props
}: PaginationProps) {
  const value = useMemo(
    () => paginationValues(page, perPage, totalCount),
    [page, perPage, totalCount],
  );
  const resolvedLabels = useMemo(() => ({ ...defaultLabels, ...labels }), [labels]);
  const setClampedPage = useCallback(
    (nextPage: number) => setPage(Math.min(Math.max(1, nextPage), value.totalPages)),
    [setPage, value.totalPages],
  );
  const context = useMemo<PaginationContextValue>(
    () => ({ ...value, controls, labels: resolvedLabels, setPage: setClampedPage }),
    [controls, resolvedLabels, setClampedPage, value],
  );

  return (
    <PaginationContext.Provider value={context}>
      <div
        data-greyui-component="pagination"
        className={`greyui-pagination ${className}`.trim()}
        {...props}
      >
        {children ?? (
          <>
            <PaginationInfo>{text}</PaginationInfo>
            <PaginationControls />
          </>
        )}
      </div>
    </PaginationContext.Provider>
  );
}

export interface PaginationInfoProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  children?: ReactNode | PaginationInfoRenderer;
}

function isPaginationInfoRenderer(
  children: PaginationInfoProps["children"],
): children is PaginationInfoRenderer {
  return typeof children === "function";
}

export function PaginationInfo({ children, className = "", ...props }: PaginationInfoProps) {
  const {
    controls: _controls,
    labels: _labels,
    setPage: _setPage,
    ...value
  } = usePaginationContext("Pagination.Info");
  const content = isPaginationInfoRenderer(children)
    ? children(value)
    : (children ?? `Showing ${value.pageShowingRange} of ${value.totalCount}`);

  return (
    <span className={`greyui-pagination-info ${className}`.trim()} {...props}>
      {content}
    </span>
  );
}

export interface PaginationControlsProps extends ComponentPropsWithoutRef<"div"> {
  mode?: "full" | "simple";
  pageSelector?: "input" | "dropdown";
}

function PaginationPageInput({ context }: { context: PaginationContextValue }) {
  const [draftPage, setDraftPage] = useState(String(context.page));

  function commitDraft() {
    const parsed = Number.parseInt(draftPage, 10);
    if (Number.isFinite(parsed)) context.setPage(parsed);
    setDraftPage(
      String(
        Number.isFinite(parsed) ? Math.min(Math.max(1, parsed), context.totalPages) : context.page,
      ),
    );
  }

  function handlePageKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitDraft();
    }
  }

  return (
    <input
      aria-label={context.labels.pageNumber}
      className="greyui-pagination-input"
      inputMode="numeric"
      min={1}
      max={context.totalPages}
      type="number"
      value={draftPage}
      onBlur={commitDraft}
      onChange={(event) => setDraftPage(event.currentTarget.value)}
      onKeyDown={handlePageKeyDown}
    />
  );
}

export function PaginationControls({
  className = "",
  mode,
  pageSelector = "input",
  ...props
}: PaginationControlsProps) {
  const context = usePaginationContext("Pagination.Controls");
  const resolvedMode = mode ?? context.controls;

  const pageOptions =
    pageSelector === "dropdown"
      ? Array.from({ length: context.totalPages }, (_, index) => index + 1)
      : [];

  return (
    <div
      role="group"
      aria-label="Pagination controls"
      className={`greyui-pagination-controls ${className}`.trim()}
      {...props}
    >
      {resolvedMode === "full" ? (
        <IconButton
          size="sm"
          label={context.labels.firstPage}
          disabled={context.page <= 1}
          onClick={() => context.setPage(1)}
        >
          |‹
        </IconButton>
      ) : null}
      <IconButton
        size="sm"
        label={context.labels.previousPage}
        disabled={context.page <= 1}
        onClick={() => context.setPage(context.page - 1)}
      >
        ‹
      </IconButton>
      {resolvedMode === "full" ? (
        <span className="greyui-pagination-page">
          {pageSelector === "dropdown" ? (
            <select
              aria-label={context.labels.pageNumber}
              className="greyui-pagination-select"
              value={context.page}
              onChange={(event) => context.setPage(Number(event.currentTarget.value))}
            >
              {pageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <PaginationPageInput key={context.page} context={context} />
          )}
          <span className="greyui-pagination-total" aria-hidden="true">
            / {context.totalPages}
          </span>
        </span>
      ) : null}
      <IconButton
        size="sm"
        label={context.labels.nextPage}
        disabled={context.page >= context.totalPages}
        onClick={() => context.setPage(context.page + 1)}
      >
        ›
      </IconButton>
      {resolvedMode === "full" ? (
        <IconButton
          size="sm"
          label={context.labels.lastPage}
          disabled={context.page >= context.totalPages}
          onClick={() => context.setPage(context.totalPages)}
        >
          ›|
        </IconButton>
      ) : null}
    </div>
  );
}

export type PaginationSeparatorProps = Omit<ComponentPropsWithoutRef<"span">, "role">;

export function PaginationSeparator({ className = "", ...props }: PaginationSeparatorProps) {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      className={`greyui-pagination-separator ${className}`.trim()}
      {...props}
    />
  );
}

export interface PaginationPageSizeProps extends Omit<
  ComponentPropsWithoutRef<"label">,
  "children" | "onChange"
> {
  value: number;
  onChange: (value: number) => void;
  options?: readonly number[];
}

export function PaginationPageSize({
  className = "",
  onChange,
  options = defaultPageSizes,
  value,
  ...props
}: PaginationPageSizeProps) {
  const { labels } = usePaginationContext("Pagination.PageSize");
  return (
    <label className={`greyui-pagination-page-size ${className}`.trim()} {...props}>
      <span>{labels.pageSize}:</span>
      <select
        aria-label={labels.pageSize}
        className="greyui-pagination-select"
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export const Pagination = Object.assign(PaginationRoot, {
  Info: PaginationInfo,
  Controls: PaginationControls,
  Separator: PaginationSeparator,
  PageSize: PaginationPageSize,
});
