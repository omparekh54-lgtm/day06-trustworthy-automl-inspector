import test from 'node:test';import assert from 'node:assert/strict';import {analyze,inferTask,leakageFindings,parseCsv,sampleCsv} from '../lib/automl.ts';
const rows=parseCsv(sampleCsv());
test('parses demo csv',()=>{assert.equal(rows.length,80);assert.ok('churned' in rows[0])});
test('infers binary target as classification',()=>assert.equal(inferTask(rows,'churned'),'classification'));
test('candidate and baseline are computed',()=>{const a=analyze(rows,'churned');assert.equal(a.task,'classification');assert.ok(a.baseline.score>=0&&a.baseline.score<=1);assert.ok(a.candidate.score>=0&&a.candidate.score<=1)});
test('flags near-direct target leakage',()=>{const bad=rows.map(r=>({...r,post_result:r.churned}));assert.ok(leakageFindings(bad,'churned').some(f=>f.severity==='high'))});
test('regression uses MAE and contract',()=>{const r=Array.from({length:40},(_,i)=>({x:i,group:i%2?'A':'B',y:3*i+2}));const a=analyze(r,'y','regression');assert.equal(a.candidate.metric,'MAE');assert.ok(a.candidate.score<a.baseline.score);assert.equal(a.contract.length,3)});
