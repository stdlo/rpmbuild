"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec_1 = require("@actions/exec");
// import * as github from '@actions/github'
// import * as io from '@actions/io'
// import * as cp from 'child_process'
// import * as fs from 'fs'
// working directory is /github/workspace
// home is /github/home
// const WORKSPACE = '/github/workspace' /* NOTE: ${WORKSPACE} might be unnecessary due to it being the cwd */
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get context
            // const { owner, repo } = github.context.repo
            // const ref = github.context.ref
            // Get inputs
            const specFile = core.getInput('spec_file');
            const topdir = core.getInput('_topdir');
            // Build rpm package
            yield exec_1.exec('rpmbuild', ['-bb', specFile, `--define="_topdir ${topdir}"`]);
            // `"_topdir ${WORKSPACE}/${topdir}"` /* NOTE: ${WORKSPACE} might be unnecessary due to it being the cwd */
            // Verify rpm file exists
            yield exec_1.exec(`ls ${topdir}/RPMS`);
            // await exec(`ls ${WORKSPACE}/${topdir}/RPMS`) /* NOTE: ${WORKSPACE} might be unnecessary due to it being the cwd */
            //TODO: Set outputs. ref https://github.com/naveenrajm7/rpmbuild/blob/master/src/main.ts#L75-L113
            // set outputs to path relative to workspace ex ./rpmbuild/
            //TODO: Get arch from running something like `rpmbuild ${specFile} --getArch` or something
            let rpm_path = '';
            yield exec_1.exec('ls', [`${topdir}/RPMS/**/*.rpm`], {
                listeners: {
                    stdout: (data) => {
                        rpm_path += data.toString();
                    }
                }
            });
            core.setOutput('rpm_path', rpm_path);
            core.setOutput('rpm_content_type', 'application/octet-stream'); // Content-type for Upload
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
