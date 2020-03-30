require 'yaml'

module WorkflowRunner
  class Runner
    class WorkflowLoadError < StandardError; end

    attr_reader :outputs, :errors, :contexts, :timings, :allocations

    def initialize(workflow_desc, language = :yaml)
      @workflow_desc = load_workflow(workflow_desc, language)
      @steps = @workflow_desc['steps']
      @outputs = {}
      @errors = {}
      @contexts = {}
      @timings = {}
      @allocations = {}
    end

    def run
      prev_env = Environment.new

      @steps.each do |step|
        begin
          env = Environment.run(step['code'], prev_env)
          record_env_run(step['id'], env)
          prev_env = env

        rescue Environment::RuntimeException => err
          record_env_run(step['id'], env)
          puts "Runtime error - Stopping workflow"
          break
        end
      end
    end

    def run_step(id:, context:)
      @steps.each do |step|
        next unless step['id'] == id

        begin
          env = Environment.new
          env.context = context
          env.run(step['code'])
          record_env_run(step['id'], env)
        rescue Environment::RuntimeException => err
          record_env_run(step['id'], env)
          puts "Runtime error - Stopping workflow"
          break
        end
      end
    end

    def record_env_run(step_id, env)
      @outputs[step_id] = env.output_str
      @errors[step_id] = env.error_str
      @contexts[step_id] = env.context
      @timings[step_id] = env.timings
      @allocations[step_id] = env.allocations
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
