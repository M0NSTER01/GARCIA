export interface BodyType {
  type: 'hourglass' | 'pear' | 'rectangle' | 'inverted-triangle' | 'apple';
  description: string;
  recommendations: {
    tops: string[];
    bottoms: string[];
    dresses: string[];
    accessories: string[];
  };
}

export interface AnalysisResult {
  bodyType: BodyType;
  confidence: number;
  measurements?: {
    shoulders: number;
    waist: number;
    hips: number;
  };
}