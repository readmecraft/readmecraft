/**
 * History manager for undo / redo functionality.
 * Framework-agnostic: operates on pure serialized state snapshots.
 */

export class HistoryStack {
  /**
   * @param {number} maxSnapshots
   */
  constructor(maxSnapshots = 40) {
    this.maxSnapshots = maxSnapshots;
    this.past = [];
    this.future = [];
  }

  /**
   * Push a new snapshot onto the stack
   * @param {any} state
   */
  push(state) {
    // Deep clone to prevent mutations
    const snapshot = JSON.stringify(state);

    // Skip if identical to current top
    if (this.past.length > 0 && this.past[this.past.length - 1] === snapshot) {
      return;
    }

    this.past.push(snapshot);
    if (this.past.length > this.maxSnapshots) {
      this.past.shift();
    }
    // Clear redo branch on new action
    this.future = [];
  }

  /**
   * Check if undo is available
   * @returns {boolean}
   */
  canUndo() {
    return this.past.length > 1;
  }

  /**
   * Check if redo is available
   * @returns {boolean}
   */
  canRedo() {
    return this.future.length > 0;
  }

  /**
   * Undo to previous state
   * @returns {any|null}
   */
  undo() {
    if (!this.canUndo()) return null;
    const current = this.past.pop();
    this.future.push(current);
    const previous = this.past[this.past.length - 1];
    return JSON.parse(previous);
  }

  /**
   * Redo to next state
   * @returns {any|null}
   */
  redo() {
    if (!this.canRedo()) return null;
    const next = this.future.pop();
    this.past.push(next);
    return JSON.parse(next);
  }

  /**
   * Reset the history stack with initial state
   * @param {any} initialState
   */
  reset(initialState) {
    this.past = [JSON.stringify(initialState)];
    this.future = [];
  }
}

