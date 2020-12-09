import * as core from '@actions/core'
import { exec } from '@actions/exec'

const SOURCES = 'rpmbuild/SOURCES'

async function run(): Promise<void> {
  try {
    // Get inputs
    const specFile = core.getInput('spec_file')
    const srcArchive = core.getInput('src_archive')
    // const topdir = core.getInput('_topdir')

    console.log(srcArchive)
    await exec(`mkdir -p ${SOURCES}`)
    await exec('mv', [srcArchive, SOURCES])

    // Build rpm package
    // await exec(`rpmbuild -bb ${specFile} --define="_topdir /github/workspace/${topdir}"`)
    await exec(`rpmbuild -bb ${specFile} --define="_topdir /github/workspace/rpmbuild"`)

    // Set outputs
    let rpm_path = ''
    // await exec('find', [`${topdir}/RPMS`, '-type', 'f'], {
    await exec('find', ['rpmbuild/RPMS', '-type', 'f'], {
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
