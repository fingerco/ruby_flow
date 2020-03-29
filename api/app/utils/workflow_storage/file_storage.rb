require 'fileutils'
require_relative 'errors'

module WorkflowStorage
  class FileStorage
    DIRECTORY = '/usr/src/app/workflows'

    def initialize(language = 'yaml')
      @language = 'yaml'

      initialize_directory
    end

    def save_workflow(path, workflow_desc)
      FileUtils.mkdir_p(File.dirname(safer_path(path)))
      File.write("#{safer_path(path)}.#{@language}", workflow_desc)
    end

    def get_workflow(path)
      File.read("#{safer_path(path)}.#{@language}")
    end

    def list_workflows(path)
      Dir.entries(safer_path(path)).select do |entry|
        File.file?(File.join(safer_path(path), entry)) && entry.end_with?(".#{@language}")
      end.map{|filename| filename.gsub(".#{@language}", "")}
    end

    def list_dirs(path)
      Dir.entries(File.join(DIRECTORY, safer_path(path))).select do |entry|
        File.directory? File.join(DIRECTORY, entry) and !(entry =='.' || entry == '..')
      end
    end

    def initialize_directory
      Dir.mkdir(DIRECTORY) unless File.exists?(DIRECTORY)
    end

    private

    def safer_path(path)
      unless path.present? && path.match(/[A-Za-z\/ ]/)
        raise Errors::PathError.new("Invalid path")
      end

      File.join(DIRECTORY, path)
    end

  end
end
