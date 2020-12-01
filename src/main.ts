import * as core from '@actions/core'
import { exec } from '@actions/exec'
import * as github from '@actions/github'
// import * as io from '@actions/io'
// import * as cp from 'child_process'
// import * as fs from 'fs'

// working directory is /github/workspace
// home is /github/home

async function run(): Promise<void> {
  try {
    // Get Context
    console.log('## getting context')
    const {owner, repo} = github.context.repo
    const ref = github.context.ref
    console.log({owner, repo, ref})

    // Get Inputs
    console.log('## getting inputs')
    const specFile = core.getInput('spec_file')
    const topdir = core.getInput('_topdir')
    console.log({specFile, topdir})

    // Log some things
    console.log('###########################')
    console.log(`## ls _topdir(${topdir})`)
    await exec(`ls ${topdir}`)
    console.log(`## ls rpmbuild home(/github/home/rpmbuild)`)
    await exec('ls /github/home')
    await exec('ls /github/home/rpmbuild')
    console.log('###########################')
    // END

    console.log('## running rpmdev-setuptree')
    await exec('rpmdev-setuptree')

    const COMMAND = `rpmbuild -bb ${specFile} --define "_topdir /github/workspace/${topdir}"`
    console.log(`## running ${COMMAND}`)
    await exec(COMMAND)
    console.log('## COMPLETED rpmbuild command')

    await exec(`ls /github/workspace/${topdir}`)
    await exec(`ls /github/workspace/${topdir}/RPMS`)

    //TODO: Set outputs. ref https://github.com/naveenrajm7/rpmbuild/blob/master/src/main.ts#L75-L113
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
