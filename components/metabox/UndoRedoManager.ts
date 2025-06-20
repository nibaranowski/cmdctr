export class UndoRedoManager<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];
  private maxStackSize: number;

  constructor(maxStackSize: number = 50) {
    this.maxStackSize = maxStackSize;
  }

  pushState(state: T): void {
    // Deep clone the state to avoid reference issues
    const clonedState = this.deepClone(state);
    
    this.undoStack.push(clonedState);
    
    // Clear redo stack when new state is pushed
    this.redoStack = [];
    
    // Maintain max stack size
    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }
  }

  undo(): T | null {
    if (this.undoStack.length === 0) {
      return null;
    }

    const currentState = this.undoStack.pop()!;
    this.redoStack.push(currentState);
    
    const previousState = this.undoStack[this.undoStack.length - 1];
    return previousState ? this.deepClone(previousState) : null;
  }

  redo(): T | null {
    if (this.redoStack.length === 0) {
      return null;
    }

    const nextState = this.redoStack.pop()!;
    this.undoStack.push(this.deepClone(nextState));
    
    return nextState;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  private deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepClone(item)) as unknown as T;
    }

    if (typeof obj === 'object') {
      const clonedObj = {} as T;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }

    return obj;
  }
} 