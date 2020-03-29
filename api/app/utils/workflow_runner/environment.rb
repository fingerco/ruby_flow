module WorkflowRunner
  class Environment
    attr_accessor :context, :output_str

    def initialize
      @context = {}
      @output_str = nil
    end

    def self.run(code, prev_env = nil)
      env = Environment.new
      env.rehydrate(prev_env) if prev_env
      env.run(code)

      env
    end

    def run(code)
      $stdout = StringIO.new
      self.instance_eval(code)
      self.output_str = $stdout.string
      $stdout = STDOUT
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
