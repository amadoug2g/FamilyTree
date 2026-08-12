"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import type { TreeNode as TreeNodeData } from "@/lib/tree";

// Profondeur jusqu'a laquelle les branches sont depliees par defaut.
// Au-dela, une branche affiche son nombre de descendants et se deplie au clic.
const DEFAULT_EXPANDED_DEPTH = 3;

export function FamilyTree({ node }: { node: TreeNodeData }) {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  function toggle(id: string, defaultExpanded: boolean) {
    setOverrides((prev) => ({ ...prev, [id]: !(prev[id] ?? defaultExpanded) }));
  }

  return (
    <div className="text-sm">
      <TreeNodeRow node={node} depth={0} overrides={overrides} onToggle={toggle} />
    </div>
  );
}

function TreeNodeRow({
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
    <div>
      <div className="flex items-center gap-2 py-1.5">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(node.person.id, defaultExpanded)}
            aria-label={expanded ? "Replier" : "Déplier"}
            className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-border text-xs text-muted hover:border-accent hover:text-accent"
          >
            {expanded ? "−" : "+"}
          </button>
        ) : (
          <span className="w-6 flex-none" />
        )}

        <Link href={`/people/${node.person.id}`} className="flex items-center gap-2 hover:text-accent">
          <Avatar name={node.person.name} photoUrl={node.person.profilePhotoUrl} size={32} />
          <span className={`font-medium ${node.person.isDeceased ? "text-muted" : ""}`}>
            {node.person.name}
          </span>
        </Link>

        {node.spouses.map((spouse) => (
          <Link
            key={spouse.unionId}
            href={`/people/${spouse.id}`}
            className="text-xs text-muted hover:text-accent"
            title="Conjoint(e)"
          >
            <span aria-hidden>•</span> {spouse.name}
          </Link>
        ))}

        {hasChildren && !expanded && (
          <span className="text-xs text-muted">
            {node.descendantCount} descendant{node.descendantCount > 1 ? "s" : ""}
          </span>
        )}

        <Link
          href={`/?racine=${node.person.id}`}
          className="ml-auto flex-none text-base text-muted hover:text-accent"
          title="Recentrer l'arbre sur cette personne"
          aria-label="Recentrer l'arbre sur cette personne"
        >
          ◎
        </Link>
      </div>

      {hasChildren && expanded && (
        <ul className="ml-3 border-l border-border pl-4">
          {node.children.map((child) => (
            <li key={child.person.id} className="relative before:absolute before:-left-4 before:top-4 before:h-px before:w-4 before:bg-border">
              <TreeNodeRow node={child} depth={depth + 1} overrides={overrides} onToggle={onToggle} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
