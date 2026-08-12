"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import type { TreeNode as TreeNodeData } from "@/lib/tree";
import styles from "./FamilyTree.module.css";

// Profondeur jusqu'a laquelle les branches sont depliees par defaut.
// Au-dela, une boite affiche son nombre de descendants et se deplie au clic.
const DEFAULT_EXPANDED_DEPTH = 2;

export function FamilyTree({ node }: { node: TreeNodeData }) {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Le diagramme est souvent bien plus large que l'ecran (racine centree
  // au-dessus de tout l'arbre) : on centre la vue au chargement pour que la
  // racine soit visible d'emblee, plutot que de montrer le bord gauche.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [node.person.id]);

  function toggle(id: string, defaultExpanded: boolean) {
    setOverrides((prev) => ({ ...prev, [id]: !(prev[id] ?? defaultExpanded) }));
  }

  return (
    <div ref={scrollRef} className="overflow-x-auto pb-8">
      <div className={styles.tree}>
        <ul>
          <TreeNodeItem node={node} depth={0} overrides={overrides} onToggle={toggle} />
        </ul>
      </div>
    </div>
  );
}

function TreeNodeItem({
  node,
  depth,
  overrides,
  onToggle,
}: {
  node: TreeNodeData;
  depth: number;
  overrides: Record<string, boolean>;
  onToggle: (id: string, defaultExpanded: boolean) => void;
}) {
  const hasChildren = node.children.length > 0;
  const defaultExpanded = depth < DEFAULT_EXPANDED_DEPTH;
  const expanded = overrides[node.person.id] ?? defaultExpanded;

  return (
    <li>
      <div className={styles.nodeBox}>
        <div className="relative rounded-lg border border-border bg-surface p-2 shadow-sm">
          <Link
            href={`/?racine=${node.person.id}`}
            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-[10px] text-muted hover:border-accent hover:text-accent"
            title="Recentrer l'arbre sur cette personne"
            aria-label="Recentrer l'arbre sur cette personne"
          >
            ◎
          </Link>

          <Link href={`/people/${node.person.id}`} className="flex flex-col items-center gap-1 hover:text-accent">
            <Avatar name={node.person.name} photoUrl={node.person.profilePhotoUrl} size={44} />
            <span className={`text-xs font-medium leading-tight ${node.person.isDeceased ? "text-muted" : ""}`}>
              {node.person.name}
            </span>
          </Link>
          <p className="text-[10px] text-muted">Génération {depth + 1}</p>

          {node.spouses.length > 0 && (
            <div className="mt-1 space-y-0.5 border-t border-border pt-1">
              {node.spouses.map((spouse) => (
                <Link
                  key={spouse.unionId}
                  href={`/people/${spouse.id}`}
                  className="block truncate text-[10px] text-muted hover:text-accent"
                  title={`Conjoint(e) : ${spouse.name}`}
                >
                  ⚭ {spouse.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {hasChildren && (
          <button
            type="button"
            onClick={() => onToggle(node.person.id, defaultExpanded)}
            className="mx-auto mt-1.5 block rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-muted hover:border-accent hover:text-accent"
          >
            {expanded ? "− replier" : `+ ${node.descendantCount} descendant${node.descendantCount > 1 ? "s" : ""}`}
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <ul>
          {node.children.map((child) => (
            <TreeNodeItem key={child.person.id} node={child} depth={depth + 1} overrides={overrides} onToggle={onToggle} />
          ))}
        </ul>
      )}
    </li>
  );
}
