import sdk from '@stackblitz/sdk';
import { Project } from '@stackblitz/sdk/typings/interfaces';

import { StackBlitzExampleConfig } from './stackblitz-example-config';

/**
 * Utility to interact with the StackBlitz sdk
 */
export class StackBlitzUtil {
  /**
   * Embed a StackBlitz in the given html elemnt ID.
   * @param elementId The HTML element's id to embed the stackblitz
   * @param config The configuration describing the example code
   */
  static embed(elementId: string, config: StackBlitzExampleConfig): void {
    sdk.embedProject(elementId, this._createProject(config), {
      height: '100%',
      clickToLoad: true,
    });
  }

  /**
   * Create the StackBlitz project from the example configuration
   * @param config The example code configuration
   * @returns a StackBlitz project.
   */
  private static _createProject(config: StackBlitzExampleConfig): Project {
    const project: Project = {
      files: {
        'index.ts': this._replaceSharedPathImports(config.tsFileContents),
        'index.html': config.htmlFileContents,
      },
      title: config.title,
      description: config.description,
      template: 'typescript',
      tags: ['rds', 'mtna', 'charting', 'data vizualization', 'metadata'],
      dependencies: config.dependencies,
    };
    if (config.otherFiles?.length) {
      for (const file of config.otherFiles) {
        project.files[file.path] = file.contents;
      }
    }

    return project;
  }

  /**
   * Replace imports from `shared` to relative `./shared`.
   * In this application the shared files are set up to
   * resolve via typescript paths, configured in the tsconfig.json.
   * However, StackBlitz does not yet support typescript paths,
   * so we set up the file structure correctly and use relative imports.
   *
   * @param rawFileContents raw file contents on which to perform a replace.
   * @returns raw file contents with relative shared imports.
   */
  private static _replaceSharedPathImports(rawFileContents: string): string {
    return rawFileContents.replace(/} from '~\/shared/g, `} from './shared`);
  }
}
