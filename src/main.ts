import * as core from '@actions/core'
import { exec } from '@actions/exec'
// import * as github from '@actions/github'
// import * as io from '@actions/io'
// import * as cp from 'child_process'
// import * as fs from 'fs'

// working directory is /github/workspace
// home is /github/home

// const WORKSPACE = '/github/workspace' /* NOTE: ${WORKSPACE} might be unnecessary due to it being the cwd */
async function run(): Promise<void> {
  try {
    // Get context
    // const { owner, repo } = github.context.repo
    // const ref = github.context.ref

    // Get inputs
    const specFile = core.getInput('spec_file')
    const topdir = core.getInput('_topdir')

    // Build rpm package
    await exec('rpmbuild', [
      '-bb',
      specFile,
      '--define',
      `"_topdir ${topdir}"`
      // `"_topdir ${WORKSPACE}/${topdir}"` /* NOTE: ${WORKSPACE} might be unnecessary due to it being the cwd */
    ])

    // Verify rpm file exists
    await exec(`ls ${topdir}/RPMS`)
    // await exec(`ls ${WORKSPACE}/${topdir}/RPMS`) /* NOTE: ${WORKSPACE} might be unnecessary due to it being the cwd */

    //TODO: Set outputs. ref https://github.com/naveenrajm7/rpmbuild/blob/master/src/main.ts#L75-L113
    // set outputs to path relative to workspace ex ./rpmbuild/
    //TODO: Get arch from running something like `rpmbuild ${specFile} --getArch` or something
    let rpm_path = ''
    await exec('ls', [`${topdir}/RPMS/**/*.rpm`], {
      listeners: {
        stdout: (data: Buffer) => {
          rpm_path += data.toString()
        }
      }
    })

    core.setOutput('rpm_path', rpm_path)
    core.setOutput('rpm_content_type', 'application/octet-stream') // Content-type for Upload
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
