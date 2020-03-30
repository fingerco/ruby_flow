require "benchmark"
require "allocation_stats"

module WorkflowRunner
  class Environment
    attr_accessor :context, :output_str, :error_str, :timings, :allocations
    class RuntimeException < Exception; end

    def initialize
      @context = {}
      @output_str = ''
      @error_str = ''
      @timings = {}
      @allocations = {}
    end

    def self.run(code, prev_env = nil)
      env = Environment.new
      env.rehydrate(prev_env) if prev_env
      env.run(code)

      env
    end

    def run(code)
      $stdout = StringIO.new
      $stderr = StringIO.new

      time = Benchmark.measure do
        begin
          self.instance_eval(code)
        rescue Exception => err
          $stderr.puts err
          $stderr.puts err.backtrace
          raise RuntimeException.new(err)
        ensure
          self.output_str = $stdout.string
          self.error_str = $stderr.string
          $stdout = STDOUT
          $stderr = STDERR
        end
      end

      @timings['step_total'] = time
    end

    def record_timing(name, &block)
      time = Benchmark.measure do
        self.instance_eval(&block)
      end

      @timings[name] = time
    end

    def record_allocations(name, &block)
      stats = AllocationStats.trace do
        self.instance_eval(&block)
      end

      @allocations[name] = stats.allocations(alias_paths: true).to_text
    end

    def set_context_var(name, value)
      @context[name] = value
    end

    def get_context_var(name)
      @context[name]
    end

    def rehydrate(env)
      @context = @context.merge(env.context)
    end

  end
end
