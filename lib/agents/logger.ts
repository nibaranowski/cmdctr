export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface TaskMetrics {
  total_tasks: number;
  tasks_by_status: Record<string, number>;
  average_completion_time: number;
  queue_length: number;
}

interface AgentMetrics {
  agent_id: string;
  agent_name: string;
  tasks_completed: number;
  tasks_failed: number;
  average_execution_time: number;
  success_rate: number;
  last_activity: string;
}

class Logger {
  private level: LogLevel = 'info';
  private performanceMetrics: PerformanceMetric[] = [];
  private taskMetrics: TaskMetrics = {
    total_tasks: 0,
    tasks_by_status: {},
    average_completion_time: 0,
    queue_length: 0
  };
  private agentMetrics: Map<string, AgentMetrics> = new Map();

  setLevel(level: LogLevel) {
    this.level = level;
  }

  info(message: string, ...args: any[]) {
    if (['info', 'debug'].includes(this.level)) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (['warn', 'info', 'debug'].includes(this.level)) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]) {
    if (['error', 'warn', 'info', 'debug'].includes(this.level)) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.level === 'debug') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  // Performance monitoring methods
  startTimer(operation: string, metadata?: Record<string, any>): string {
    const timerId = `timer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();
    
    if (this.level === 'debug') {
      this.debug(`Started timer for operation: ${operation}`, { timerId, metadata });
    }
    
    // Store timer info (in a real implementation, this would be in memory or Redis)
    (global as any).__timers = (global as any).__timers || new Map();
    (global as any).__timers.set(timerId, { operation, startTime, metadata });
    
    return timerId;
  }

  endTimer(timerId: string, additionalMetadata?: Record<string, any>): PerformanceMetric | null {
    const timers = (global as any).__timers;
    if (!timers || !timers.has(timerId)) {
      this.warn(`Timer not found: ${timerId}`);
      return null;
    }

    const timer = timers.get(timerId);
    const endTime = performance.now();
    const duration = endTime - timer.startTime;
    
    const metric: PerformanceMetric = {
      operation: timer.operation,
      duration,
      timestamp: new Date().toISOString(),
      metadata: { ...timer.metadata, ...additionalMetadata }
    };

    this.performanceMetrics.push(metric);
    timers.delete(timerId);

    if (this.level === 'debug') {
      this.debug(`Completed operation: ${timer.operation}`, { duration: `${duration.toFixed(2)}ms`, metric });
    } else {
      this.info(`Performance: ${timer.operation} completed in ${duration.toFixed(2)}ms`);
    }

    return metric;
  }

  // Task metrics tracking
  updateTaskMetrics(status: string, completionTime?: number): void {
    this.taskMetrics.total_tasks++;
    this.taskMetrics.tasks_by_status[status] = (this.taskMetrics.tasks_by_status[status] || 0) + 1;
    
    if (completionTime && status === 'completed') {
      const currentAvg = this.taskMetrics.average_completion_time;
      const completedCount = this.taskMetrics.tasks_by_status['completed'] || 0;
      this.taskMetrics.average_completion_time = (currentAvg * (completedCount - 1) + completionTime) / completedCount;
    }

    if (this.level === 'debug') {
      this.debug('Task metrics updated', { status, completionTime, metrics: this.taskMetrics });
    }
  }

  setQueueLength(length: number): void {
    this.taskMetrics.queue_length = length;
    if (this.level === 'debug') {
      this.debug(`Queue length updated: ${length}`);
    }
  }

  // Agent metrics tracking
  updateAgentMetrics(agentId: string, agentName: string, success: boolean, executionTime?: number): void {
    let metrics = this.agentMetrics.get(agentId);
    
    if (!metrics) {
      metrics = {
        agent_id: agentId,
        agent_name: agentName,
        tasks_completed: 0,
        tasks_failed: 0,
        average_execution_time: 0,
        success_rate: 0,
        last_activity: new Date().toISOString()
      };
      this.agentMetrics.set(agentId, metrics);
    }

    if (success) {
      metrics.tasks_completed++;
    } else {
      metrics.tasks_failed++;
    }

    if (executionTime) {
      const totalTasks = metrics.tasks_completed + metrics.tasks_failed;
      const currentAvg = metrics.average_execution_time;
      metrics.average_execution_time = (currentAvg * (totalTasks - 1) + executionTime) / totalTasks;
    }

    metrics.success_rate = metrics.tasks_completed / (metrics.tasks_completed + metrics.tasks_failed);
    metrics.last_activity = new Date().toISOString();

    if (this.level === 'debug') {
      this.debug('Agent metrics updated', { agentId, success, executionTime, metrics });
    }
  }

  // Get performance reports
  getPerformanceReport(): {
    recent_metrics: PerformanceMetric[];
    task_metrics: TaskMetrics;
    agent_metrics: AgentMetrics[];
    summary: {
      total_operations: number;
      average_duration: number;
      slowest_operation: PerformanceMetric | null;
      fastest_operation: PerformanceMetric | null;
    };
  } {
    const recentMetrics = this.performanceMetrics.slice(-100); // Last 100 metrics
    const agentMetricsArray = Array.from(this.agentMetrics.values());
    
    const totalOperations = recentMetrics.length;
    const averageDuration = totalOperations > 0 
      ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / totalOperations 
      : 0;
    
    const slowestOperation = recentMetrics.length > 0 
      ? recentMetrics.reduce((slowest, current) => current.duration > slowest.duration ? current : slowest)
      : null;
    
    const fastestOperation = recentMetrics.length > 0 
      ? recentMetrics.reduce((fastest, current) => current.duration < fastest.duration ? current : fastest)
      : null;

    return {
      recent_metrics: recentMetrics,
      task_metrics: this.taskMetrics,
      agent_metrics: agentMetricsArray,
      summary: {
        total_operations: totalOperations,
        average_duration: averageDuration,
        slowest_operation: slowestOperation,
        fastest_operation: fastestOperation
      }
    };
  }

  // Clear old metrics (for memory management)
  clearOldMetrics(olderThanHours: number = 24): void {
    const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);
    this.performanceMetrics = this.performanceMetrics.filter(
      metric => new Date(metric.timestamp).getTime() > cutoffTime
    );
    
    if (this.level === 'debug') {
      this.debug(`Cleared metrics older than ${olderThanHours} hours`);
    }
  }
}

export const logger = new Logger(); 