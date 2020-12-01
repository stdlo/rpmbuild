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
const github = __importStar(require("@actions/github"));
// import * as io from '@actions/io'
// import * as cp from 'child_process'
// import * as fs from 'fs'
// working directory is /github/workspace
// home is /github/home
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get Context
            console.log('## getting context');
            const { owner, repo } = github.context.repo;
            const ref = github.context.ref;
            console.log({ owner, repo, ref });
            // Get Inputs
            console.log('## getting inputs');
            const specFile = core.getInput('spec_file');
            const topdir = core.getInput('_topdir');
            console.log({ specFile, topdir });
            // Log some things
            console.log('###########################');
            console.log('## Eval existing topdir: rpm --eval "%{_topdir}"');
            yield exec_1.exec('rpm --eval "%{_topdir}"');
            console.log(`## ls _topdir(${topdir})`);
            yield exec_1.exec(`ls ${topdir}`);
            console.log(`## ls rpmbuild home(/github/home/rpmbuild)`);
            yield exec_1.exec('ls /github/home');
            // await exec('ls /github/home/rpmbuild') // this directory doesnt exist, default is likly /root/rpmbuild
            console.log('###########################');
            // END
            const COMMAND = `rpmbuild -bb ${specFile} --define "_topdir /github/workspace/${topdir}"`;
            console.log(`## running ${COMMAND}`);
            yield exec_1.exec(COMMAND);
            console.log('## COMPLETED rpmbuild command');
            yield exec_1.exec(`ls /github/workspace/${topdir}`);
            yield exec_1.exec(`ls /github/workspace/${topdir}/RPMS`);
            //TODO: Set outputs. ref https://github.com/naveenrajm7/rpmbuild/blob/master/src/main.ts#L75-L113
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
