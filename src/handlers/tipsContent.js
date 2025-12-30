const maxTipsOpen = 2;

const tipsContent = {
  jobs_earning_money: `**Jobs**
- View tips in the Jobs category

\`Which jobs are the best?\` In my opinion, there's no better job but a quick and effortless job is Ben's ice cream.

\`Which jobs are the easiest?\` I think Fisherman, miner, and Ice Cream are the top 3 easy ones.

**Earning Money**
- View tips in the Earning Money category

\`Best money-making methods\` Focus on high-paying jobs like pizza delivery.

\`Job comparison and earnings\` Compare earnings per hour to choose the best job.

\`Passive income strategies\` Invest in properties and businesses.`,

  gardening_landscaping: `**Gardening**
- View tips in the Gardening category

\`Blueberry farms\` High yield, quick growth.

\`Orange farms\` Moderate yield, great for beginners.

\`Blackberry farms\` High yield, requires more care.

\`Lemon tree farms\` Low yield, but aesthetically pleasing.`,

  gamepasses_customization: `**Gamepasses**
- View tips in the Gamepasses category

\`Which gamepasses are the best?\` Multiple Floors: Essential for bigger houses.

\`Which gamepasses are good for beginners?\` Basements: Adds extra space.

\`Explaining game passes\` Advanced Placement: Allows precise item placement.

**Customization**
- View tips in the Customization category

\`Avatar customization tips\` Use unique outfits and accessories.

\`House exterior customization\` Use landscaping and exterior decor.

\`Personalized decorations\` Add custom paintings and furniture.`,

  building_real_estate: `**Building**
- View tips in the Building category

\`Efficient layout designs\` Use open floor plans to maximize space.

\`Budget-friendly builds\` Utilize cheaper materials to save money.

\`Advanced building techniques\` Incorporate custom structures for a unique look.

**Real Estate**
- View tips in the Real Estate category

\`Buying and selling houses\` Research the market and set fair prices.

\`Real estate investment tips\` Invest in high-demand areas.

\`Flipping houses for profit\` Renovate and resell properties.`,

  decorating_interior_design: `**Decorating**
- View tips in the Decorating category

\`Interior design ideas\` Mix and match furniture styles.

\`Using color schemes\` Complementary colors create a harmonious look.

\`Furniture arrangement tips\` Keep pathways clear for easy movement.

**Interior Design**
- View tips in the Interior Design category

\`Maximizing space\` Use space-saving furniture and layouts.

\`Creating cozy atmospheres\` Add warmth and comfort to your designs.

\`Functional interior layouts\` Design practical and attractive spaces.`,

  cooking_food: `**Cooking**
- View tips in the Cooking category

\`Best recipes for skill leveling\` Focus on high-yield dishes like pizza and burgers.

\`Efficient cooking techniques\` Prepare multiple dishes at once to save time.

\`Food presentation tips\` Use plates and garnishes for a professional look.

**Food**
- View tips in the Food category

\`Favorite dishes\` Explore a variety of recipes to find what you enjoy.

\`Healthy eating\` Balance meals with nutritious ingredients.

\`Cooking for groups\` Plan meals that can serve multiple people.`,

  events_festive_ideas: `**Events**
- View tips in the Events category

\`How to host a successful party\` Plan activities and provide refreshments.

\`Seasonal event ideas\` Host holiday-themed parties with appropriate decorations.

\`Event planning tips\` Create a schedule and send out invitations early.

**Festive Ideas**
- View tips in the Festive Ideas category

\`Holiday-themed builds\` Create seasonal structures.

\`Event hosting during festive seasons\` Plan holiday parties and events.

\`Festive decoration tips\` Use seasonal decor to celebrate.`,

  vehicles_transportation: `**Vehicles**
- View tips in the Vehicles category

\`Best vehicles for transportation\` Use cars for speed and convenience.

\`Vehicle customization tips\` Upgrade paint and rims for a personalized look.

\`Maintenance and care\` Regularly check and repair your vehicles.`,

  skills_tutorials: `**Skills**
- View tips in the Skills category

\`Fastest ways to level up skills\` Practice regularly and focus on one skill at a time.

\`Skill-specific tips and tricks\` Use guides to master each skill efficiently.

\`Maximizing skill benefits\` Utilize skill boosts and perks.

**Tutorials**
- View tips in the Tutorials category

\`Step-by-step building guides\` Follow detailed guides for complex builds.

\`How to decorate like a pro\` Use advanced decorating techniques.

\`Advanced gameplay tutorials\` Learn expert tips and tricks.`,

  house_security_safety: `**House Security**
- View tips in the House Security category

\`Preventing break-ins\` Use locks and security systems.

\`Using security cameras\` Monitor your home remotely.

\`Best practices for home security\` Keep valuables hidden and secure.`,

  roleplaying_community: `**Roleplaying**
- View tips in the Roleplaying category

\`Creating engaging scenarios\` Develop detailed storylines and characters.

\`Roleplaying etiquette\` Respect other players and stay in character.

\`Building roleplay-specific structures\` Create realistic environments for your roleplay.

**Community**
- View tips in the Community category

\`Making friends in Bloxburg\` Join groups and participate in events.

\`Community engagement tips\` Be active and helpful in the community.

\`Hosting social events\` Plan and promote gatherings.`,

  trading_economy: `**Trading**
- View tips in the Trading category

\`Safe trading practices\` Use trusted platforms and verify items.

\`High-demand items\` Focus on rare and popular items.

\`Trading strategies\` Negotiate for the best deals.

**Economy**
- View tips in the Economy category

\`Efficient ways to save money\` Cut costs without sacrificing quality.

\`Best investments in-game\` Choose high-return investments.

\`Managing your budget\` Track and adjust your spending.`,

  pets_care: `**Pets**
- View tips in the Pets category

\`Best pets to have\` Choose pets based on your lifestyle.

\`Pet care tips\` Provide food, water, and regular exercise.

\`Training your pets\` Use rewards and consistent commands.`,

  seasonal_tips_trends: `**Seasonal Tips**
- View tips in the Seasonal Tips category

\`Decorating for holidays\` Use themed decorations and lights.

\`Seasonal event participation\` Join community events and competitions.

\`Seasonal builds and themes\` Create season-specific structures.

**Community Trends**
- View tips in the Community Trends category

\`Popular building styles\` Follow trends to stay current.

\`Trending roleplay scenarios\` Join popular roleplay themes.

\`Community events\` Participate in and host events.`,

  bloxburg_updates_secrets: `**Bloxburg Updates**
- View tips in the Bloxburg Updates category

\`Recent updates overview\` Stay informed about new features.

\`New features and how to use them\` Explore and utilize new content.

\`Patch notes highlights\` Understand changes and fixes.

**Bloxburg Secrets**
- View tips in the Bloxburg Secrets category

\`Hidden features and Easter eggs\` Discover secret areas and items.

\`Little-known gameplay tricks\` Utilize advanced strategies.

\`Secret spots in Bloxburg\` Explore off-the-beaten-path locations.`,

  customization_tools_techniques: `**Customization Tools**
- View tips in the Customization Tools category

\`Using advanced placement tools\` Place items precisely where you want.

\`Best custom textures and colors\` Create unique looks with custom options.

\`Creating unique designs\` Combine elements for personalized creations.`,

  content_creation_streaming: `**Content Creation**
- View tips in the Content Creation category

\`Recording and streaming Bloxburg\` Use software and hardware effectively.

\`Building a Bloxburg YouTube channel\` Create engaging content and grow your audience.

\`Engaging with your audience\` Interact and respond to viewers.`,

  neighborhoods_community_events: `**Neighborhoods**
- View tips in the Neighborhoods category

\`Creating a cohesive neighborhood\` Plan layouts and themes.

\`Planning neighborhood layouts\` Design functional and attractive areas.

\`Hosting neighborhood events\` Foster community with regular activities.`,

  aesthetics_design: `**Aesthetics**
- View tips in the Aesthetics category

\`Creating beautiful interiors\` Focus on design principles.

\`Landscaping tips and tricks\` Enhance your home's exterior.

\`Harmonizing colors and styles\` Use color theory for pleasing designs.`,

  survival_gameplay_mechanics: `**Survival Tips**
- View tips in the Survival Tips category

\`Managing hunger and energy\` Balance your character's needs.

\`Efficient use of resources\` Optimize your resource usage.

\`Surviving in challenging scenarios\` Adapt to difficult situations.

**Gameplay Mechanics**
- View tips in the Gameplay Mechanics category

\`Understanding Bloxburg physics\` Master the game's physical engine.

\`Utilizing game mechanics to your advantage\` Use game features strategically.

\`Mastering controls and settings\` Customize controls for better gameplay.`,

  community_guidelines_etiquette: `**Community Guidelines**
- View tips in the Community Guidelines category

\`Following server rules\` Respect community guidelines.

\`Promoting a positive community\` Encourage positive interactions.

\`Reporting inappropriate behavior\` Know how to handle rule breakers.`,

  realism_roleplay_tips: `**Realism Tips**
- View tips in the Realism Tips category

\`Creating realistic builds\` Use real-world inspiration.

\`Adding lifelike details\` Include small touches for realism.

\`Realistic roleplay scenarios\` Plan believable roleplay stories.`,

  event_hosting_planning: `**Event Hosting**
- View tips in the Event Hosting category

\`Planning large-scale events\` Organize big community gatherings.

\`Managing guest lists\` Keep track of attendees.

\`Ensuring event security\` Provide a safe environment.`,

  building_efficiency_cost_management: `**Building Efficiency**
- View tips in the Building Efficiency category

\`Time-saving building techniques\` Build faster with these tips.

\`Cost-effective materials\` Save money on building supplies.

\`Streamlining your build process\` Optimize your workflow.`,

  user_experience_interface: `**User Experience**
- View tips in the User Experience category

\`Enhancing gameplay experience\` Optimize your settings and controls.

\`Improving interface interaction\` Customize the interface for ease of use.

\`Customizing game settings\` Adjust settings for optimal performance.`,
};

module.exports = {
  tipsContent: tipsContent,
  Max: maxTipsOpen
}
