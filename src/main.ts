import * as core from '@actions/core'
import { exec } from '@actions/exec'

async function run(): Promise<void> {
  try {
    // Get inputs
    const specFile = core.getInput('spec_file')
    const topdir = `/github/workspace/${core.getInput('_topdir')}`

    // Build rpm package
    await exec(`rpmbuild -bb ${specFile} --define="_topdir ${topdir}"`)

    // Set outputs
    let rpm_path = ''
    await exec('find', [`${topdir}/RPMS`, '-type', 'f'], {
      listeners: {
        stdout: (data: Buffer) => {
          rpm_path = data.toString().trim()
        }
      }
    })
    core.setOutput('rpm_name', rpm_path.split('/').pop())
    core.setOutput('rpm_path', rpm_path)
    core.setOutput('rpm_content_type', 'application/octet-stream') // Content-type for Upload
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
