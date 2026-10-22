import test from 'node:test';
import assert from 'node:assert/strict';

import { PermissionTranslatorEngine } from '../engines/permissionTranslator.js';
import { BehaviorEngine } from '../engines/behaviorEngine.js';
import { PrivacyEngine } from '../engines/privacyEngine.js';
import { PerformanceEngine } from '../engines/performanceEngine.js';
import { TrustEngine } from '../engines/trustEngine.js';
import { DiscoveryEngine } from '../engines/discoveryEngine.js';
import { ConflictEngine } from '../engines/conflictEngine.js';
import { DuplicateEngine } from '../engines/duplicateEngine.js';
import { ExtensionDnaEngine } from '../engines/extensionDnaEngine.js';
import { RecommendationEngine } from '../engines/recommendationEngine.js';

test('PermissionTranslatorEngine - translates <all_urls> correctly', () => {
  const result = PermissionTranslatorEngine.translatePermission('<all_urls>');
  assert.equal(result.riskLevel, 'CRITICAL');
  assert.equal(result.category, 'PRIVACY');
  assert.match(result.description, /read, modify, and intercept/i);
});

test('BehaviorEngine - detects Ad Blocker category and network request access', () => {
  const behavior = BehaviorEngine.analyzeBehavior(
    ['declarativeNetRequest', 'storage'],
    ['<all_urls>'],
    3,
    'Fast ad blocker extension',
    'uBlock Ultra'
  );
  assert.equal(behavior.primaryCategory, 'AD_BLOCKER');
  assert.equal(behavior.accessesAllSites, true);
  assert.equal(behavior.isMV3, true);
});

test('TrustEngine - calculates trust score and grade accurately', () => {
  const behavior = BehaviorEngine.analyzeBehavior(['storage'], [], 3, 'Safe utility', 'Simple Saver');
  const privacy = PrivacyEngine.analyzePrivacy(behavior, ['storage'], []);
  const trust = TrustEngine.calculateTrustScore('Simple Saver', ['storage'], [], behavior, privacy);

  assert.equal(trust.score, 100);
  assert.equal(trust.grade, 'A+');
});

test('ConflictEngine - detects multiple active ad blockers', () => {
  const mockExtensions = [
    DiscoveryEngine.processExtension({
      id: 'ext1',
      name: 'uBlock Pro',
      description: 'Ad blocker',
      version: '1.0',
      enabled: true,
      mayDisable: true,
      isApp: false,
      type: 'extension',
      installType: 'normal',
      offlineEnabled: true,
      permissions: ['declarativeNetRequest'],
      hostPermissions: ['<all_urls>']
    }),
    DiscoveryEngine.processExtension({
      id: 'ext2',
      name: 'AdBlock Max',
      description: 'Block all ads',
      version: '2.0',
      enabled: true,
      mayDisable: true,
      isApp: false,
      type: 'extension',
      installType: 'normal',
      offlineEnabled: true,
      permissions: ['declarativeNetRequest'],
      hostPermissions: ['<all_urls>']
    })
  ];

  const conflicts = ConflictEngine.detectConflicts(mockExtensions);
  assert.equal(conflicts.length, 1);
  assert.equal(conflicts[0].category, 'AD_BLOCKER');
  assert.equal(conflicts[0].severity, 'HIGH');
});

test('DuplicateEngine - identifies duplicate extensions and recommends best keep candidate', () => {
  const mockExtensions = [
    DiscoveryEngine.processExtension({
      id: 'ext1',
      name: 'Grammarly Assistant',
      description: 'Spelling checker',
      version: '1.0',
      enabled: true,
      mayDisable: true,
      isApp: false,
      type: 'extension',
      installType: 'normal',
      offlineEnabled: true,
      permissions: ['activeTab', 'storage'],
      hostPermissions: []
    }),
    DiscoveryEngine.processExtension({
      id: 'ext2',
      name: 'LanguageTool Checker',
      description: 'Grammar and spell checker',
      version: '2.0',
      enabled: true,
      mayDisable: true,
      isApp: false,
      type: 'extension',
      installType: 'normal',
      offlineEnabled: true,
      permissions: ['activeTab', 'storage', 'cookies'],
      hostPermissions: ['<all_urls>']
    })
  ];

  const duplicates = DuplicateEngine.detectDuplicates(mockExtensions);
  assert.equal(duplicates.length, 1);
  assert.equal(duplicates[0].recommendedKeepId, 'ext1');
  assert.ok(duplicates[0].estimatedMemorySavedMB > 0);
});

test('ExtensionDnaEngine - computes overall ecosystem health score', () => {
  const mockExtensions = [
    DiscoveryEngine.processExtension({
      id: 'ext1',
      name: 'Safe Utility',
      description: 'Simple tool',
      version: '1.0',
      enabled: true,
      mayDisable: true,
      isApp: false,
      type: 'extension',
      installType: 'normal',
      offlineEnabled: true,
      permissions: ['storage'],
      hostPermissions: []
    })
  ];

  const dna = ExtensionDnaEngine.analyzeEcosystem(mockExtensions);
  assert.equal(dna.totalExtensions, 1);
  assert.equal(dna.safeCount, 1);
  assert.equal(dna.ecosystemGrade, 'A+');
});
