import React, { useState } from "react";
import { Button, Card, Badge } from "flowbite-react";
import { QUERY_TEMPLATES } from "./QueryTemplates";

interface SQLShowcaseProps {
  selectedTableName: string;
  onTemplateSelect: (template: string) => void;
}

const SQLShowcase: React.FC<SQLShowcaseProps> = ({
  selectedTableName,
  onTemplateSelect,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = {
    "Basic Queries": [
      "basic",
      "count",
      "distinct",
      "limit",
    ],
    "Sorting & Filtering": [
      "orderBy",
      "dateFilter",
      "search",
    ],
    "Aggregation": [
      "aggregate",
      "groupBy",
    ],
    "Advanced": [
      "join",
      "caseStatement",
      "subquery",
    ],
  };

  const handleTemplateClick = (templateKey: string) => {
    const template = QUERY_TEMPLATES[templateKey as keyof typeof QUERY_TEMPLATES];
    let query = template.template.replace(/{table}/g, selectedTableName);
    query = query.replace(/{table1}/g, selectedTableName);
    query = query.replace(/{column}/g, "id");
    query = query.replace(/{numeric_column}/g, "id");
    query = query.replace(/{text_column}/g, "name");
    query = query.replace(/{id_column}/g, "id");
    query = query.replace(/{date_column}/g, "created_at");
    query = query.replace(/{condition}/g, "true");
    onTemplateSelect(query);
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          SQL Query Templates
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Click a template to insert it into the query editor. Perfect for learning SQL!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(categories).map(([category, templates]) => (
          <Card key={category} className="shadow-sm">
            <div
              onClick={() => setExpandedCategory(
                expandedCategory === category ? null : category
              )}
              className="cursor-pointer flex items-center justify-between"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {category}
              </h4>
              <Badge color="blue">{templates.length}</Badge>
            </div>

            {expandedCategory === category && (
              <div className="mt-4 space-y-2">
                {templates.map((templateKey) => {
                  const template =
                    QUERY_TEMPLATES[templateKey as keyof typeof QUERY_TEMPLATES];
                  return (
                    <Button
                      key={templateKey}
                      color="light"
                      size="sm"
                      onClick={() => handleTemplateClick(templateKey)}
                      className="w-full justify-start text-left"
                    >
                      <div>
                        <div className="font-medium">{template.label}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {template.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SQLShowcase;
