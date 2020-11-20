import * as core from '@actions/core'
import * as github from '@actions/github'
import {exec} from '@actions/exec'
import * as io from '@actions/io'
import * as cp from 'child_process'
import * as fs from 'fs'

// working directory is /github/workspace
// home is /github/home

async function run(): Promise<void> {
  try {
    // Get Context
    const {owner, repo} = github.context.repo
    const ref = github.context.ref

    // Get Inputs
    const specFile = core.getInput('spec_file')
    const topdir = core.getInput('_topdir')

    await exec('rpmdev-setuptree')
    await exec(
      `rpmbuild -bb ${specFile} --define "_topdir /github/workspace/${topdir}"`
    )
    await exec(`ls /github/workspace/${topdir}`)
    await exec(`ls /github/workspace/${topdir}/RPMS`)

    //TODO: Set outputs. ref https://github.com/naveenrajm7/rpmbuild/blob/master/src/main.ts#L75-L113
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
