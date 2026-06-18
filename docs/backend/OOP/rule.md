# when implement the backend for OOP concepts, follow the following rule:
- composition over inheritance
- Technical Implementation Guide: The "Never Nester" Protocol for AI-Driven Codebase Management

1. The Philosophy of Linear Logic and Cognitive Load

In high-stakes systems architecture, the structural integrity of logic is a primary determinant of long-term maintainability. Deeply nested code—layers of conditional branches and iterative blocks buried within one another—creates an exponential increase in Cyclomatic Complexity. Each level of indentation forces the human brain to manage a larger state space, leading to a "state space explosion" where the developer must simultaneously track multiple prerequisite conditions to understand a single line of execution. This elevates the "disgusting meter"—a heuristic for the Cognitive Overhead required to parse a routine. The "Never Nester" protocol establishes a rigid architectural requirement: a maximum nesting depth of three levels.

Technically, "nesting" is defined by the instantiation of inner blocks, typically demarcated by open braces. Each brace signifies a new layer of depth. While a depth of two is standard for basic logic, a depth of three is the absolute ceiling for professional-grade code. Reaching a four-level depth is categorized as a systemic failure; at this point, the logic becomes unreadable, and the probability of "off-by-one" errors or state leaks increases significantly. These constraints are not merely stylistic preferences; they are functional necessities for maintaining a codebase that is human-auditable and resilient to regression.

2. Core Strategy I: Logic Inversion and Early Returns

The primary mechanism for flattening complex logic is the prioritization of the "unhappy path" via logic inversion. Traditional nested logic often wraps the primary functional intent (the "Happy Path") within multiple positive conditional checks. This protocol reverses that flow, shifting the function from a pyramid of if statements into a linear "gatekeeping" structure. By identifying and handling negative conditions or edge cases immediately, the architect can neutralize complexity before it accumulates.

The "Anti-Else" Mandate: To execute this strategy, AI agents and developers must adhere to a strict technical directive:

1. Invert the Condition: Flip positive checks to identify the failure or "unhappy" case first.
2. Implement Early Returns/Throws: Once the unhappy case is identified, the function must return or throw immediately.
3. Flatten the Scope: Because the negative case results in a termination of the current scope, the use of else blocks is strictly prohibited after an early return. The subsequent logic must be promoted to the main function level.

This "validation gatekeeping" allows the reader to mentally discard handled states. The Happy Path must serve as the unindented "anchor" of the function, residing at the zero-to-one indentation level at the very end of the routine, cleared of all conditional noise.

3. Core Strategy II: Functional Extraction and Responsibility Segregation

Logic inversion addresses conditional depth, but Functional Extraction is required to manage the complexity of multi-state routines. Extraction involves decoupling the inner logic of loops or complex branches and re-homing them into independent, atomic functions. This enforces the Single Responsibility Principle (SRP), ensuring that "large functions that handle many things" are refactored into "small, concise functions with one responsibility."

Consider the implementation of a multi-state Download Manager handling pending, in progress, and complete states. A nested implementation would attempt to manage queue processing, HTTP error handling, and connection retries within a single loop. Under the Never Nester protocol:

* The logic for a pending state is extracted to processPending().
* The logic for an in progress state is extracted to processInProgress().
* Complex error-handling branches—such as distinguishing between a retryable HTTP 500 error and a terminal connection error that disables the interface—are extracted into dedicated sub-routines.

This transformation turns a monolithic, deeply indented "run" function into a high-level orchestration layer that calls descriptive, single-purpose sub-functions. This is critical for maintaining transparency in state-based logic.

4. The Indentation Threshold: The "Linux Kernel" Standard

Visual constraints are an objective diagnostic tool for identifying architectural decay. The "Linux Kernel" standard, famously advocated by Linus Torvalds, posits a hard rule: "If you need more than three levels of indentation, you’re screwed and should fix your program."

In professional systems programming, this is enforced through spatial cost. By utilizing an 8-character tab size, excessive nesting becomes visually untenable, physically pushing the code off the screen. This forced visual constraint makes the failure point (Level 4) impossible to ignore. It serves as an immediate signal that the current function has exceeded its cognitive budget and requires immediate refactoring via inversion or extraction.

Quick Reference: Indentation Limits

Indentation Level	Status	Architectural Action
0 - 1	Ideal	Standard for "Happy Path" and orchestration logic.
2	Acceptable	Standard for simple loops or basic validation.
3	Maximum	The absolute ceiling. Proceed with caution.
4+	Failure	Refactor Required. Immediate inversion or extraction.

5. Implementation Protocol for AI Agents: A Step-by-Step Workflow

To produce high-value, professional-grade code, AI agents must treat the "Never Nester" protocol as a mandatory system instruction. The following workflow must be applied to all code generation and refactoring tasks:

1. Depth Analysis: Calculate the maximum Cyclomatic Complexity and indentation depth (open braces) of the proposed routine.
2. Gatekeeping Phase: Identify all validation requirements and edge cases. Apply Logic Inversion to handle these first.
3. Mandatory Flattening: Eliminate all else blocks where the preceding if block contains a return, break, or throw statement.
4. Extraction Phase: If the depth remains at 3 or above, identify the "core" of the inner loop or conditional branch. Move this logic into a named sub-routine (e.g., handleResult(), validateState()).
5. Anchor the Happy Path: Finalize the function by ensuring the primary execution logic resides at the lowest possible indentation level at the bottom of the function.

By adhering to this protocol, AI agents ensure that the resulting codebase is not just functional, but architecturally sound. This approach minimizes cognitive overhead, prevents state space explosion, and ensures that the "Happy Path" is always the most visible and accessible component of the system. This leads to a flat, modular codebase with superior long-term maintainability.
