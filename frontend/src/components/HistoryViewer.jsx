import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { History, Clock, ArrowRight } from 'lucide-react';

const HistoryViewer = ({ history = [] }) => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState({ v1: null, v2: null });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('it-IT');
  };

  const handleVersionSelect = (version) => {
    if (compareMode) {
      if (!compareVersions.v1) {
        setCompareVersions({ ...compareVersions, v1: version });
      } else if (!compareVersions.v2) {
        setCompareVersions({ ...compareVersions, v2: version });
      } else {
        setCompareVersions({ v1: version, v2: null });
      }
    } else {
      setSelectedVersion(version);
    }
  };

  const getLineDiff = (oldContent, newContent) => {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    const maxLines = Math.max(oldLines.length, newLines.length);
    
    const diff = [];
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';
      
      if (oldLine !== newLine) {
        diff.push({
          lineNumber: i + 1,
          old: oldLine,
          new: newLine,
          type: oldLine === '' ? 'added' : newLine === '' ? 'removed' : 'modified'
        });
      }
    }
    return diff;
  };

  return (
    <div className="flex h-96">
      {/* History Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center">
              <History className="w-4 h-4 mr-2" />
              Versioni ({history.length})
            </h4>
            <Button
              variant={compareMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareVersions({ v1: null, v2: null });
                setSelectedVersion(null);
              }}
            >
              Confronta
            </Button>
          </div>
          {compareMode && (
            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
              Seleziona due versioni da confrontare
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {history.slice().reverse().map((version, index) => {
              const isSelected = compareMode 
                ? compareVersions.v1?.version === version.version || compareVersions.v2?.version === version.version
                : selectedVersion?.version === version.version;
              
              const isV1 = compareVersions.v1?.version === version.version;
              const isV2 = compareVersions.v2?.version === version.version;

              return (
                <Card 
                  key={version.version}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  } ${isV1 ? 'bg-green-50' : ''} ${isV2 ? 'bg-blue-50' : ''}`}
                  onClick={() => handleVersionSelect(version)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        v{version.version}
                      </Badge>
                      {compareMode && (isV1 || isV2) && (
                        <Badge variant={isV1 ? 'default' : 'secondary'} className="text-xs">
                          {isV1 ? 'V1' : 'V2'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{version.changes}</p>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(version.timestamp)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {compareMode && compareVersions.v1 && compareVersions.v2 ? (
          // Compare Mode
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-center space-x-4">
                <Badge variant="default">v{compareVersions.v1.version}</Badge>
                <ArrowRight className="w-4 h-4" />
                <Badge variant="secondary">v{compareVersions.v2.version}</Badge>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 p-4">
              {/* Version 1 */}
              <div>
                <h5 className="font-medium mb-2 text-green-700">
                  Versione {compareVersions.v1.version}
                </h5>
                <ScrollArea className="h-64 border rounded">
                  <pre className="p-3 text-xs font-mono bg-green-50">
                    {compareVersions.v1.content}
                  </pre>
                </ScrollArea>
              </div>
              
              {/* Version 2 */}
              <div>
                <h5 className="font-medium mb-2 text-blue-700">
                  Versione {compareVersions.v2.version}
                </h5>
                <ScrollArea className="h-64 border rounded">
                  <pre className="p-3 text-xs font-mono bg-blue-50">
                    {compareVersions.v2.content}
                  </pre>
                </ScrollArea>
              </div>
            </div>

            {/* Diff Summary */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <h5 className="font-medium mb-2">Differenze:</h5>
              <div className="space-y-1">
                {getLineDiff(compareVersions.v1.content, compareVersions.v2.content).map((diff, index) => (
                  <div key={index} className="text-xs">
                    <span className="font-mono text-gray-600">Riga {diff.lineNumber}: </span>
                    <span className={`inline-block px-2 py-1 rounded ${
                      diff.type === 'added' ? 'bg-green-100 text-green-800' :
                      diff.type === 'removed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {diff.type === 'added' ? 'Aggiunta' :
                       diff.type === 'removed' ? 'Rimossa' : 'Modificata'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : selectedVersion ? (
          // Single Version View
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Versione {selectedVersion.version}</h4>
                  <p className="text-sm text-gray-600">{selectedVersion.changes}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(selectedVersion.timestamp)}
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {selectedVersion.content}
              </pre>
            </ScrollArea>
          </div>
        ) : (
          // Empty State
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Seleziona una versione per visualizzarla</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryViewer;