import networkx as nx
import matplotlib.pyplot as plt
from matplotlib.widgets import Button

# --- Knowledge base ---
rules = [
    (['A'], 'B'),
    (['B'], 'C'),
    (['A', 'C'], 'D'),
    (['D'], 'E')
]

facts = set(['A'])
step_log = []  # store reasoning steps
reason_map = {}  # WHY a fact exists

# --- Graph setup ---
G = nx.DiGraph()
edge_labels = {}

for i, (premises, conclusion) in enumerate(rules):
    rule_name = f"R{i}: {' & '.join(premises)} -> {conclusion}"
    for p in premises:
        G.add_edge(p, conclusion)
        edge_labels[(p, conclusion)] = rule_name

pos = nx.spring_layout(G, seed=42)

# --- Visualization ---
fig, ax = plt.subplots()
plt.subplots_adjust(bottom=0.3)


def draw_graph(active_edges=None, highlight_nodes=None, text=""):
    ax.clear()

    node_colors = []
    for node in G.nodes():
        if highlight_nodes and node in highlight_nodes:
            node_colors.append('orange')
        elif node in facts:
            node_colors.append('green')
        else:
            node_colors.append('lightgray')

    edge_colors = []
    for edge in G.edges():
        if active_edges and edge in active_edges:
            edge_colors.append('red')
        else:
            edge_colors.append('gray')

    nx.draw(G, pos, with_labels=True, node_color=node_colors,
            edge_color=edge_colors, ax=ax, node_size=1500, width=2)

    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_size=8, ax=ax)

    ax.set_title(f"Facts: {sorted(facts)}")

    ax.text(0.02, -0.25, text, transform=ax.transAxes, fontsize=10,
            bbox=dict(facecolor='white', alpha=0.8))


def explain_fact(fact):
    # recursively explain why a fact exists
    if fact not in reason_map:
        return fact

    premises = reason_map[fact]
    chain = f"{fact} because ({' & '.join(premises)})"
    for p in premises:
        chain += "\n  -> " + explain_fact(p)
    return chain


def on_click(event):
    # detect nearest node click
    if event.inaxes != ax:
        return

    for node, (x, y) in pos.items():
        if (event.xdata - x)**2 + (event.ydata - y)**2 < 0.05:
            explanation = explain_fact(node)
            draw_graph(text=f"Why {node}:\n{explanation}")
            plt.draw()
            break


def animate_forward_chain(event=None):
    applied = True
    step = 0

    while applied:
        applied = False

        for premises, conclusion in rules:
            if set(premises).issubset(facts) and conclusion not in facts:
                step += 1

                active_edges = [(p, conclusion) for p in premises]

                text = f"Step {step}: {' & '.join(premises)} -> {conclusion}"

                draw_graph(active_edges=active_edges,
                           highlight_nodes=premises + [conclusion],
                           text=text)
                plt.pause(1.0)

                facts.add(conclusion)
                step_log.append((premises, conclusion))
                reason_map[conclusion] = premises

                draw_graph(highlight_nodes=[conclusion],
                           text=f"Added: {conclusion}")
                plt.pause(1.0)

                applied = True
                break

    draw_graph(text="Done (click node to see WHY)")


def reset(event=None):
    global facts, step_log, reason_map
    facts = set(['A'])
    step_log = []
    reason_map = {}
    draw_graph(text="Reset")


# --- Buttons ---
ax_run = plt.axes([0.15, 0.05, 0.3, 0.1])
btn_run = Button(ax_run, 'Run')
btn_run.on_clicked(animate_forward_chain)

ax_reset = plt.axes([0.55, 0.05, 0.3, 0.1])
btn_reset = Button(ax_reset, 'Reset')
btn_reset.on_clicked(reset)

# click interaction
fig.canvas.mpl_connect('button_press_event', on_click)

# Initial draw
draw_graph(text="Click Run → then click any node to see reasoning")
plt.show()
