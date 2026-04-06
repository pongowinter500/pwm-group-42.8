import type { Schema, Struct } from '@strapi/strapi';

export interface AboutPageComponentsHero extends Struct.ComponentSchema {
  collectionName: 'components_about_page_components_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface AboutPageComponentsMission extends Struct.ComponentSchema {
  collectionName: 'components_about_page_components_missions';
  info: {
    displayName: 'mission';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface AboutPageComponentsOffer extends Struct.ComponentSchema {
  collectionName: 'components_about_page_components_offers';
  info: {
    displayName: 'offer';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

export interface BusinessPageComponentsFeatures extends Struct.ComponentSchema {
  collectionName: 'components_business_page_components_features';
  info: {
    displayName: 'features';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    Featureid: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BusinessPageComponentsHero extends Struct.ComponentSchema {
  collectionName: 'components_business_page_components_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    contactEmail: Schema.Attribute.Email & Schema.Attribute.Required;
    contactEmailText: Schema.Attribute.String;
    Description: Schema.Attribute.String;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CourseAttributesTopic extends Struct.ComponentSchema {
  collectionName: 'components_course_attributes_topics';
  info: {
    displayName: 'Topic';
  };
  attributes: {
    TopicName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about-page-components.hero': AboutPageComponentsHero;
      'about-page-components.mission': AboutPageComponentsMission;
      'about-page-components.offer': AboutPageComponentsOffer;
      'business-page-components.features': BusinessPageComponentsFeatures;
      'business-page-components.hero': BusinessPageComponentsHero;
      'course-attributes.topic': CourseAttributesTopic;
    }
  }
}
