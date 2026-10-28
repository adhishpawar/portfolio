import styles from "./PipelineDiagram.module.scss";

export interface PipelineNode {
  id: string;
  label: string;
  detail: string;
}

const BOX_W = 190;
const BOX_H = 80;
const STEP_X = 180;
const STEP_Y = 140;
const MARGIN = 20;

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// A stepped pipeline drawn from data. The SVG is an accessible image named by
// `title`, and an ordered list carries the same content as text.
export function PipelineDiagram({ nodes, title }: { nodes: PipelineNode[]; title: string }) {
  if (nodes.length === 0) return null;

  const titleId = `pipeline-title-${slug(title)}`;
  const at = (i: number) => ({ x: MARGIN + i * STEP_X, y: MARGIN + i * STEP_Y });
  const width = MARGIN * 2 + (nodes.length - 1) * STEP_X + BOX_W;
  const height = MARGIN * 2 + (nodes.length - 1) * STEP_Y + BOX_H;

  const connector = nodes
    .slice(0, -1)
    .map((_, i) => {
      const from = at(i);
      const to = at(i + 1);
      return `M ${from.x + BOX_W / 2} ${from.y + BOX_H} V ${from.y + BOX_H + 30} H ${to.x + BOX_W / 2} V ${to.y}`;
    })
    .join(" ");

  return (
    <div className={styles.diagram}>
      <svg
        className={styles.svg}
        role="img"
        aria-labelledby={titleId}
        viewBox={`0 0 ${width} ${height}`}
      >
        <title id={titleId}>{title}</title>
        {connector ? <path data-connector className={styles.connector} d={connector} /> : null}
        {nodes.map((node, i) => {
          const { x, y } = at(i);
          const last = i === nodes.length - 1;
          return (
            <g key={node.id} data-node={node.id} className={last ? styles.last : undefined}>
              <rect className={styles.box} x={x} y={y} width={BOX_W} height={BOX_H} rx={2} />
              <text className={styles.label} x={x + 20} y={y + 35}>
                {node.label}
              </text>
              <text className={styles.detail} x={x + 20} y={y + 58}>
                {node.detail}
              </text>
            </g>
          );
        })}
      </svg>
      <ol className="sr-only">
        {nodes.map((node) => (
          <li key={node.id}>
            {node.label}: {node.detail}
          </li>
        ))}
      </ol>
    </div>
  );
}
