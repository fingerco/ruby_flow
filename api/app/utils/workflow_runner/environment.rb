module WorkflowRunner
  class Environment
    attr_accessor :output_str
    attr_reader :context

    def initialize
      @context = {}
      @output_str = nil
    end

    def self.run(code, prev_env = nil)
      env = Environment.new
      env.rehydrate(prev_env) if prev_env

      $stdout = StringIO.new
      env.instance_eval(code)
      env.output_str = $stdout.string
      $stdout = STDOUT

      env
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
