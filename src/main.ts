import * as core from '@actions/core'
import { exec } from '@actions/exec'

const WORKSPACE = '/github/workspace'
const TOPDIR = 'rpmbuild'
const TOPDIR_ABS = `${WORKSPACE}/${TOPDIR}`
const SOURCES = `${TOPDIR_ABS}/SOURCES`

async function run(): Promise<void> {
  try {
    /* Get inputs */
    const specFile = core.getInput('spec_file')
    const srcArchive = core.getInput('src_archive')

    /* Setup rpmbuild topdir */
    await exec(`mkdir -p ${SOURCES}`)
    await exec('mv', [srcArchive, SOURCES])

    /* Build rpm package */
    await exec(`rpmbuild -bb ${specFile} --define="_topdir ${TOPDIR_ABS}"`)

    /* Set outputs */
    let rpm_path = ''
    // use relative topdir so find returns a relative path for use in output
    await exec('find', [`${TOPDIR}/RPMS`, '-type', 'f'], {
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
