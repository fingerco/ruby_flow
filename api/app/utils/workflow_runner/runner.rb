require 'yaml'

module WorkflowRunner
  class Runner
    class WorkflowLoadError < StandardError; end

    def initialize(workflow_desc, language = :yaml)
      @workflow_desc = load_workflow(workflow_desc, language)
      @steps = @workflow_desc['steps']
    end

    def run
      @steps.each do |step|
        self.instance_eval(step['code'])
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
