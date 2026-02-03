# Forward Chaining Visualization

## Introduction

This is a Python program using NetworkX and Matplotlib libraries to visualize the **Forward Chaining** process in artificial intelligence.

### What is Forward Chaining?

Forward Chaining is a logical reasoning method in AI where we start from known **facts** and use **rules** to infer new facts. This process continues until no more facts can be inferred.

#### Simple Example:
- **Initial Facts**: A
- **Rules**:
  1. A → B
  2. B → C
  3. A ∧ C → D
  4. D → E

Process:
1. From A, apply Rule 1: infer B
2. From B, apply Rule 2: infer C
3. From A and C, apply Rule 3: infer D
4. From D, apply Rule 4: infer E
5. End, no more rules can be applied.

## Usage

1. Ensure you have Python and required libraries:
   - networkx
   - matplotlib

   Install if not available:
   ```
   pip install networkx matplotlib
   ```

2. Run the program:
   ```
   python3 this.py
   ```

3. A graphical window will appear with:
   - Top-left: Graph representing facts and rules
   - Top-right: Step-by-step explanation
   - Bottom-left: Knowledge Base Rules
   - Bottom-right: Facts Status

4. Click "Run Forward Chaining" to start the animation, or "Reset" to go back to initial state.

## Visualization Explanation

### Graph
- **Nodes**: Represent potential facts (A, B, C, D, E)
- **Edges**: Represent rules, with labels like "R1: A → B"

### Colors
- **Green**: Known facts
- **Gray**: Unknown facts
- **Orange**: Facts being processed
- **Red**: Edges of rules being applied

### Animation
- Shows each step of rule application
- Highlights premises and conclusion
- Updates facts and provides detailed explanation

## Code Structure

- `rules`: List of rules
- `facts`: Set of initial facts
- `G`: NetworkX graph
- `draw_graph()`: Function to draw graph and text
- `animate_forward_chain()`: Function to perform forward chaining with animation

## Customization

You can change `rules` and initial `facts` to experiment with other examples.

Example:
```python
rules = [
    (['Sunny'], 'Go Outside'),
    (['Rainy'], 'Stay Inside')
]
facts = set(['Sunny'])
```

## Notes

- The program uses Matplotlib for GUI, may need appropriate backend on some systems.
- If there are issues with Vietnamese fonts, the program will fallback to default fonts.</content>
<parameter name="filePath">/Users/thundercock2/Documents/Github/dump/irrelevant/README.md
