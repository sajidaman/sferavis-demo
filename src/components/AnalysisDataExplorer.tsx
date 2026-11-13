import React, { useEffect, useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { ANALYSIS_DATASETS, loadAnalysisDataset } from '../data/analysisDatasets';
import type { CsvTable } from '../utils/parseCsv';

const PAGE_SIZE = 25;

export const AnalysisDataExplorer: React.FC = () => {
  const [datasetId, setDatasetId] = useState(ANALYSIS_DATASETS[0].id);
  const [table, setTable] = useState<CsvTable | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [diagnosticTrackletId, setDiagnosticTrackletId] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dataset = ANALYSIS_DATASETS.find((item) => item.id === datasetId) ?? ANALYSIS_DATASETS[0];

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setTable(null);
    setPage(0);

    void loadAnalysisDataset(datasetId)
      .then((loadedTable) => {
        if (active) setTable(loadedTable);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : String(loadError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [datasetId, retryCount]);

  const filteredRows = useMemo(() => {
    if (!table) return [];
    const query = search.trim().toLocaleLowerCase();
    if (!query) return table.rows;
    return table.rows.filter((row) =>
      table.headers.some((header) => row[header]?.toLocaleLowerCase().includes(query))
    );
  }, [search, table]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pageRows = filteredRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const assetUrl = `${import.meta.env.BASE_URL}data/analyzed/${dataset.fileName}`;

  return (
    <section className="border-t border-zinc-800 pt-4" aria-labelledby="analysis-data-title">
      <div className="mb-2 flex items-center justify-between">
        <h3 id="analysis-data-title" className="font-lexend text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">
          Analysis Data Explorer
        </h3>
        <span className="font-mono text-[9px] text-zinc-500">{ANALYSIS_DATASETS.length} tables</span>
      </div>
      <p className="mb-3 text-[10px] leading-relaxed text-zinc-500">
        User-supplied products; their pipeline and classifications are not independently validated. The coordinates are overlaid on the selected sky image for context only; image cutouts are not included.
      </p>

      <label className="mb-2 block">
        <span className="sr-only">Choose an analysis table</span>
        <select
          value={datasetId}
          onChange={(event) => {
            setDatasetId(event.target.value);
            setSearch('');
          }}
          className="w-full border border-zinc-700 bg-black px-2.5 py-2 font-lexend text-[10px] text-white outline-none focus:border-[#A30000]"
        >
          {Array.from(new Set(ANALYSIS_DATASETS.map((item) => item.group))).map((group) => (
            <optgroup key={group} label={group}>
              {ANALYSIS_DATASETS.filter((item) => item.group === group).map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <p className="mb-3 text-[10px] leading-relaxed text-zinc-400">{dataset.description}</p>
      <div className="mb-3 flex items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Search rows"
            aria-label="Search rows in selected table"
            className="w-full border border-zinc-700 bg-black py-2 pl-7 pr-2 font-mono text-[10px] text-white outline-none placeholder:text-zinc-600 focus:border-[#A30000]"
          />
        </label>
        <a
          href={assetUrl}
          download={dataset.fileName}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-zinc-700 text-zinc-300 transition hover:border-[#A30000] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000]"
          aria-label={`Download ${dataset.fileName}`}
          title={`Download ${dataset.fileName}`}
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      {loading && <p className="py-4 text-center text-[10px] text-zinc-400">Loading table…</p>}
      {error && (
        <div role="alert" className="border border-red-900/60 bg-red-950/30 p-2 text-[10px] text-red-200">
          <p>{error}</p>
          <button type="button" onClick={() => setRetryCount((current) => current + 1)} className="mt-2 underline underline-offset-2 hover:text-white">
            Retry loading table
          </button>
        </div>
      )}
      {table && !loading && (
        <>
          <p className="mb-2 font-mono text-[9px] text-zinc-500" aria-live="polite">
            {filteredRows.length.toLocaleString()} of {table.rows.length.toLocaleString()} rows
          </p>
          <div className="max-h-72 overflow-auto border border-zinc-800">
            <table className="w-full border-collapse text-left font-mono text-[9px]">
              <thead className="sticky top-0 bg-[#0b111c] text-zinc-300">
                <tr>
                  {table.headers.map((header) => (
                    <th key={header} scope="col" className="whitespace-nowrap border-b border-zinc-700 px-2 py-2 font-semibold">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, rowIndex) => (
                  <tr key={`${page}-${rowIndex}`} className="odd:bg-white/[0.025]">
                    {table.headers.map((header) => (
                      <td key={header} className="max-w-40 truncate border-b border-zinc-800/80 px-2 py-1.5 text-zinc-400" title={row[header]}>
                        {row[header] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr><td colSpan={table.headers.length} className="px-3 py-5 text-center text-zinc-500">No matching rows.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <button type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0} className="border border-zinc-700 px-2.5 py-1.5 text-[9px] text-zinc-300 hover:border-[#A30000] disabled:cursor-not-allowed disabled:opacity-40">
              Previous
            </button>
            <span className="font-mono text-[9px] text-zinc-500">Page {page + 1} / {pageCount}</span>
            <button type="button" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={page >= pageCount - 1} className="border border-zinc-700 px-2.5 py-1.5 text-[9px] text-zinc-300 hover:border-[#A30000] disabled:cursor-not-allowed disabled:opacity-40">
              Next
            </button>
          </div>
        </>
      )}
      <details className="mt-4 border border-zinc-800 bg-black/30">
        <summary className="cursor-pointer px-3 py-2.5 font-lexend text-[9px] font-bold uppercase tracking-wider text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30000]">
          Tracklet diagnostic plots
        </summary>
        <div className="border-t border-zinc-800 p-2.5">
          <label className="mb-2 flex items-center justify-between gap-2 text-[9px] uppercase tracking-wider text-zinc-400">
            <span>Tracklet ID</span>
            <select
              value={diagnosticTrackletId}
              onChange={(event) => setDiagnosticTrackletId(Number(event.target.value))}
              className="border border-zinc-700 bg-black px-2 py-1 font-mono text-[10px] text-white"
            >
              {Array.from({ length: 14 }, (_, id) => <option key={id} value={id}>{id}</option>)}
            </select>
          </label>
          <figure>
            <img
              src={`${import.meta.env.BASE_URL}data/analyzed/diagnostics/candidate_${String(diagnosticTrackletId).padStart(4, '0')}.png`}
              alt={`Supplied diagnostic plot for tracklet ${diagnosticTrackletId}, showing three observation cutouts and the measured motion path`}
              className="h-auto w-full border border-zinc-800"
              loading="lazy"
            />
            <figcaption className="mt-1 text-[9px] text-zinc-500">
              User-supplied diagnostic; see the tracklet tables for measured values.
            </figcaption>
          </figure>
        </div>
      </details>
    </section>
  );
};
