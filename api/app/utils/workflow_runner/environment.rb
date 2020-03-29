module WorkflowRunner
  class Environment
    attr_reader :context

    def initialize
      @context = {}
    end

    def self.run(code, prev_env = nil)
      env = Environment.new
      env.rehydrate(prev_env) if prev_env

      env.instance_eval(code)
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
