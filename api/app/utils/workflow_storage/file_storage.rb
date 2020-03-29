require 'fileutils'
require 'yaml'
require_relative 'errors'

module WorkflowStorage
  class FileStorage
    DIRECTORY = '/usr/src/app/workflows'
    PROJECTS_DIR = File.join(DIRECTORY, 'projects')

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

    def list_projects(path)
      dirs = Dir.entries(safer_path(path)).select do |entry|
        File.directory? File.join(safer_path(path), entry) and !(entry =='.' || entry == '..')
      end

      dirs.map do |dir|
        project_manifest = File.join(safer_path(path), dir, 'manifest.yaml')
        YAML.load_file(project_manifest).to_h.merge({path: dir})
      end
    end

    def initialize_directory
      Dir.mkdir(DIRECTORY) unless File.exists?(DIRECTORY)
      Dir.mkdir(PROJECTS_DIR) unless File.exists?(PROJECTS_DIR)
    end

    def create_project(path, name)
      project_dir = File.join(PROJECTS_DIR, path)
      Dir.mkdir(project_dir) unless File.exists?(project_dir)

      manifest_file = File.join(project_dir, 'manifest.yaml')
      File.write(manifest_file, {
        'name' => name
      }.to_yaml)

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
