require 'yaml'

module WorkflowRunner
  class Runner
    class WorkflowLoadError < StandardError; end

    attr_reader :outputs, :contexts

    def initialize(workflow_desc, language = :yaml)
      @workflow_desc = load_workflow(workflow_desc, language)
      @steps = @workflow_desc['steps']
      @outputs = {}
      @contexts = {}
    end

    def run
      prev_env = Environment.new

      @steps.each do |step|
        env = Environment.run(step['code'], prev_env)

        @outputs[step['id']] = env.output_str
        @contexts[step['id']] = env.context

        prev_env = env
      end
    end

    def load_workflow(desc, language)
      case language
      when :yaml
        YAML.load(desc).to_h

      else
        raise WorkflowLoadError.new("Unknown workflow language: #{language}")

      end
    end

  end
end
